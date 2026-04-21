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

  function toggleKnockout(knockerId: string, victimId: string) {
    setKnockouts((prev) => {
      const current = prev[knockerId] || [];
      const updated = current.includes(victimId)
        ? current.filter((id) => id !== victimId)
        : [...current, victimId];
      return { ...prev, [knockerId]: updated };
    });
  }

  function totalKnockouts() {
    return Object.values(knockouts).reduce((sum, k) => sum + k.length, 0);
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
                setActivePlayer(activePlayer === player.id ? null : player.id)
              }
              className="w-full px-6 py-4 flex items-center justify-between"
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
                <span className="text-text-secondary text-sm">
                  {activePlayer === player.id ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {activePlayer === player.id && (
              <div className="px-6 pb-4 flex flex-col gap-2 border-t border-gray-100 pt-3">
                <p className="text-xs text-text-secondary mb-1">
                  {player.name} knocked out:
                </p>
                {players
                  .filter((p) => p.id !== player.id)
                  .map((victim) => (
                    <button
                      key={victim.id}
                      onClick={() => toggleKnockout(player.id, victim.id)}
                      className={`py-2 px-4 rounded-xl text-sm font-medium border transition-colors ${
                        knockouts[player.id]?.includes(victim.id)
                          ? "bg-accent text-white border-accent"
                          : "bg-background text-text-primary border-gray-100"
                      }`}
                    >
                      {victim.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onNext(knockouts)}
        className="w-full py-4 bg-accent text-white rounded-2xl font-medium"
      >
        Continue {totalKnockouts() > 0 ? `(${totalKnockouts()} knockouts)` : ""}
      </button>
    </div>
  );
}
