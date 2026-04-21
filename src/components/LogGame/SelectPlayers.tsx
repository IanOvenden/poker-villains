"use client";

import { useState } from "react";
import type { Player } from "@/types";

interface Props {
  players: Player[];
  initialSelected: Player[];
  onNext: (selected: Player[]) => void;
}

export default function SelectPlayers({
  players,
  initialSelected,
  onNext,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSelected.map((p) => p.id)),
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleNext() {
    const selectedPlayers = players.filter((p) => selected.has(p.id));
    onNext(selectedPlayers);
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
        onClick={handleNext}
        disabled={selected.size < 2}
        className="w-full py-4 bg-accent text-white rounded-2xl font-medium disabled:opacity-40 transition-opacity"
      >
        Continue ({selected.size} players)
      </button>
    </div>
  );
}
