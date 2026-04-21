"use client";

import { processGame } from "@/lib/pointsEngine";
import type { Player } from "@/types";
import type { LogGameState } from "./LogGameStepper";
import type { GamePlayer } from "@/lib/pointsEngine";

interface Props {
  state: LogGameState;
  players: Player[];
  isSaving: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ConfirmGame({
  state,
  players,
  isSaving,
  onConfirm,
  onBack,
}: Props) {
  const gamePlayers: GamePlayer[] = players.map((p) => ({
    playerId: p.id,
    position: state.positions[p.id],
    knockouts: state.knockouts[p.id] || [],
  }));

  const summary = processGame(gamePlayers);

  const sortedResults = [...summary.results].sort(
    (a, b) => a.position - b.position,
  );

  function getPlayerName(id: string) {
    return players.find((p) => p.id === id)?.name ?? id;
  }

  const positionLabels: Record<number, string> = {
    1: "1st",
    2: "2nd",
    3: "3rd",
  };
  function getLabel(pos: number) {
    return positionLabels[pos] || `${pos}th`;
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
        Confirm game
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        Review results before saving
      </p>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Total pot</p>
          <p className="text-xl font-medium text-text-primary">
            £{summary.potTotal}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Season pot</p>
          <p className="text-xl font-medium text-accent">
            £{summary.seasonPotContribution}
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3 mb-8">
        {sortedResults.map((result) => (
          <div
            key={result.playerId}
            className="bg-surface rounded-2xl px-4 py-4 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`text-sm font-medium w-8 ${result.position === 1 ? "text-accent" : "text-text-secondary"}`}
              >
                {getLabel(result.position)}
              </span>
              <span className="flex-1 font-medium text-text-primary">
                {getPlayerName(result.playerId)}
              </span>
              <span className="font-medium text-text-primary">
                {result.points} pts
              </span>
              {result.prizeMoney > 0 && (
                <span className="text-accent font-medium">
                  £{result.prizeMoney}
                </span>
              )}
            </div>
            {result.knockouts.length > 0 && (
              <p className="text-xs text-text-secondary ml-11">
                Knocked out: {result.knockouts.map(getPlayerName).join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onConfirm}
        disabled={isSaving}
        className="w-full py-4 bg-accent text-white rounded-2xl font-medium disabled:opacity-40"
      >
        {isSaving ? "Saving..." : "Save game"}
      </button>
    </div>
  );
}
