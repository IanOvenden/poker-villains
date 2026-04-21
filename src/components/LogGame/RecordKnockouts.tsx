"use client";

import { useState } from "react";
import type { Player } from "@/types";

interface Props {
  players: Player[];
  initialKnockouts: Record<string, string[]>;
  onNext: (knockouts: Record<string, string[]>) => void;
  onBack: () => void;
}

export default function RecordKnockouts({
  players,
  initialKnockouts,
  onNext,
  onBack,
}: Props) {
  const [knockouts, setKnockouts] =
    useState<Record<string, string[]>>(initialKnockouts);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);

  const knockedOutPlayerIds = new Set(Object.values(knockouts).flat());

  function toggleKnockout(knockerId: string, victimId: string) {
    setKnockouts((prev) => {
      const current = prev[knockerId] || [];
      const updated = current.includes(victimId)
        ? current.filter((id) => id !== victimId)
        : [...current, victimId];
      return { ...prev, [knockerId]: updated };
    });
  }

  const totalKnockouts = Object.values(knockouts).reduce(
    (sum, k) => sum + k.length,
    0,
  );
  const requiredKnockouts = players.length - 1;
  const allAllocated = totalKnockouts === requiredKnockouts;

  function handleNext() {
    onNext(knockouts);
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-text-secondary text-sm mb-6 flex items-center gap-1"
      >
        ← Back
      </button>
      <h2 className="text-xl font-medium text-text-primary mb-1">
        Record knockouts
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        Tap a player to record who they knocked out
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-surface rounded-2xl border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() =>
                !knockedOutPlayerIds.has(player.id) &&
                setActivePlayer(activePlayer === player.id ? null : player.id)
              }
              disabled={knockedOutPlayerIds.has(player.id)}
              className={`w-full px-6 py-4 flex items-center justify-between ${
                knockedOutPlayerIds.has(player.id)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <span className="font-medium text-text-primary">
                {player.name}
              </span>
              <div className="flex items-center gap-3">
                {(knockouts[player.id]?.length ?? 0) > 0 && (
                  <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                    {knockouts[player.id].length} KO
                  </span>
                )}
                {knockedOutPlayerIds.has(player.id) ? (
                  <span className="text-xs text-text-secondary">
                    Knocked out
                  </span>
                ) : (
                  <span className="text-text-secondary text-sm">
                    {activePlayer === player.id ? "▲" : "▼"}
                  </span>
                )}
              </div>
            </button>

            {activePlayer === player.id && (
              <div className="px-6 pb-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
                <p className="text-xs text-text-secondary mb-1">
                  {player.name} knocked out:
                </p>
                {players
                  .filter((p) => p.id !== player.id)
                  .map((victim) => {
                    const isKnockedOut = knockouts[player.id]?.includes(
                      victim.id,
                    );
                    const knockedOutByOther =
                      !isKnockedOut &&
                      Object.entries(knockouts).some(
                        ([knockerId, victims]) =>
                          knockerId !== player.id &&
                          victims.includes(victim.id),
                      );
                    return (
                      <button
                        key={victim.id}
                        onClick={() =>
                          !knockedOutByOther &&
                          toggleKnockout(player.id, victim.id)
                        }
                        disabled={knockedOutByOther}
                        className={`py-2 px-4 rounded-xl text-sm font-medium border transition-colors ${
                          isKnockedOut
                            ? "bg-accent text-white border-accent"
                            : knockedOutByOther
                              ? "bg-background text-text-secondary border-gray-100 opacity-40 cursor-not-allowed"
                              : "bg-background text-text-primary border-gray-100"
                        }`}
                      >
                        {victim.name}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!allAllocated}
        className={`w-full py-4 rounded-2xl font-medium transition-colors ${
          allAllocated
            ? "bg-accent text-white"
            : "bg-gray-200 text-text-secondary cursor-not-allowed"
        }`}
      >
        {allAllocated
          ? `Continue (${totalKnockouts} knockouts)`
          : `${totalKnockouts} / ${requiredKnockouts} knockouts allocated`}
      </button>
    </div>
  );
}
