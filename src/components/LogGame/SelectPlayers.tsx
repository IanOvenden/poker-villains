"use client";

import {
  addPlayerToSelection,
  removePlayerFromSelection,
} from "@/lib/draftGame";
import type { Player } from "@/types";

interface Props {
  players: Player[];
  selectedPlayerIds: string[];
  draftId: string;
  onNext: () => void;
}

export default function SelectPlayers({
  players,
  selectedPlayerIds,
  draftId,
  onNext,
}: Props) {
  const selected = new Set(selectedPlayerIds);

  async function toggle(id: string) {
    if (selected.has(id)) {
      await removePlayerFromSelection(draftId, id);
    } else {
      await addPlayerToSelection(draftId, id);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-medium text-text-primary mb-1">
        Who's playing?
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        Select all players in tonight's game
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => toggle(player.id)}
            className={`w-full py-4 px-6 rounded-2xl text-left font-medium border transition-colors ${
              selected.has(player.id)
                ? "bg-accent text-white border-accent"
                : "bg-surface text-text-primary border-gray-100"
            }`}
          >
            {player.name}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={selected.size < 2}
        className="w-full py-4 bg-accent text-white rounded-2xl font-medium disabled:opacity-40 transition-opacity"
      >
        Continue ({selected.size} players)
      </button>
    </div>
  );
}
