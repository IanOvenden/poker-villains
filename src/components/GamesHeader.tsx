"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeToDraftCollection } from "@/lib/draftGame";
import type { DraftGame, Season } from "@/types";

interface Props {
  initialDraft: DraftGame | null;
  season: Season | null;
  gameCount: number;
}

export default function GamesHeader({
  initialDraft,
  season,
  gameCount,
}: Props) {
  const [draft, setDraft] = useState<DraftGame | null>(initialDraft);

  useEffect(() => {
    const unsubscribe = subscribeToDraftCollection(setDraft);
    return unsubscribe;
  }, []);

  return (
    <>
      {draft && (
        <Link
          href={`/games/log/${draft.id}`}
          className="flex items-center justify-between mb-4 px-4 py-3 bg-accent/10 border border-accent/20 rounded-2xl"
        >
          <div>
            <p className="text-sm font-medium text-accent">Game in progress</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Tap to join and continue logging
            </p>
          </div>
          <span className="text-accent text-lg">→</span>
        </Link>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Games</h1>
          <h2 className="text-lg font-medium text-accent mt-0.5">
            Season {season?.number}
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            {gameCount} of 30 games played
          </p>
        </div>
        {draft ? (
          <Link
            href={`/games/log/${draft.id}`}
            className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            Join game
          </Link>
        ) : (
          <Link
            href="/games/log"
            className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            + Log game
          </Link>
        )}
      </div>
    </>
  );
}
