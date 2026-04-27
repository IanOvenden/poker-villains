"use client";

import { useState } from "react";
import { setSessionOverride, removeSessionOverride } from "@/lib/firestore";
import { buildSchedule, formatSessionDate } from "@/lib/schedule";
import type { SessionOverride } from "@/types";

interface Props {
  seasonId: string;
  startDate: string;
  gameCount: number;
  totalGames: number;
  initialOverrides: Record<string, SessionOverride> | undefined;
}

interface EditingState {
  sessionIndex: number;
  date: string;
  reason: string;
}

export default function PostponeSchedule({
  seasonId,
  startDate,
  gameCount,
  totalGames,
  initialOverrides,
}: Props) {
  const [overrides, setOverrides] = useState<Record<string, SessionOverride>>(
    initialOverrides ?? {}
  );
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [saving, setSaving] = useState(false);

  const schedule = buildSchedule(startDate, gameCount, totalGames, overrides);

  function openEdit(sessionIndex: number) {
    const session = schedule[sessionIndex];
    setEditing({
      sessionIndex,
      date: session.date.toISOString().slice(0, 10),
      reason: session.postponeReason ?? "",
    });
  }

  function close() {
    setEditing(null);
  }

  async function save() {
    if (!editing || !editing.date) return;
    setSaving(true);
    try {
      const override: SessionOverride = {
        customDate: new Date(editing.date).toISOString(),
        ...(editing.reason.trim() ? { reason: editing.reason.trim() } : {}),
      };
      await setSessionOverride(seasonId, editing.sessionIndex, override);
      setOverrides((prev) => ({ ...prev, [String(editing.sessionIndex)]: override }));
      close();
    } finally {
      setSaving(false);
    }
  }

  async function restore(sessionIndex: number) {
    setSaving(true);
    try {
      await removeSessionOverride(seasonId, sessionIndex);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[String(sessionIndex)];
        return next;
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="divide-y divide-gray-100">
        {schedule.map((session) => {
          const sessionIndex = session.sessionNumber - 1;
          return (
            <div
              key={session.sessionNumber}
              className={`flex items-center justify-between px-4 py-3 ${
                session.status === "next" ? "bg-accent/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    session.status === "complete"
                      ? "bg-accent text-white"
                      : session.status === "next"
                        ? "bg-accent/20 text-accent"
                        : "bg-gray-100 text-text-secondary"
                  }`}
                >
                  {session.status === "complete" ? "✓" : session.sessionNumber}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      session.status === "upcoming"
                        ? "text-text-secondary"
                        : "text-text-primary"
                    }`}
                  >
                    {formatSessionDate(session.date)}
                    {session.postponed && (
                      <span className="ml-2 text-xs font-normal text-text-secondary line-through">
                        {formatSessionDate(session.originalDate)}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Games {session.game1} &amp; {session.game2}
                    {session.postponeReason && (
                      <span> · {session.postponeReason}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {session.postponed && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Postponed
                  </span>
                )}
                {session.status === "next" && (
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    Next
                  </span>
                )}
                {session.status !== "complete" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(sessionIndex)}
                      disabled={saving}
                      title={session.postponed ? "Edit postponement" : "Postpone session"}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors disabled:opacity-40"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <line x1="9" y1="16" x2="15" y2="16" />
                        <line x1="12" y1="13" x2="12" y2="19" />
                      </svg>
                    </button>
                    {session.postponed && (
                      <button
                        onClick={() => restore(sessionIndex)}
                        disabled={saving}
                        title="Restore original date"
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 10h10a8 8 0 018 8v2" />
                          <polyline points="3 10 9 4 9 16" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editing !== null && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm p-5">
            <h3 className="text-base font-medium text-text-primary mb-4">
              Postpone session {editing.sessionIndex + 1}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text-secondary block mb-1">
                  New date
                </label>
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) =>
                    setEditing((prev) => prev && { ...prev, date: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">
                  Reason{" "}
                  <span className="text-text-secondary font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={editing.reason}
                  onChange={(e) =>
                    setEditing((prev) => prev && { ...prev, reason: e.target.value })
                  }
                  placeholder="e.g. Bank Holiday"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={close}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-text-secondary disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={!editing.date || saving}
                className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
