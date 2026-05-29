"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getActiveSeason,
  getGamesBySeason,
  getPlayers,
  getActiveDraft,
} from "@/lib/firestore";
import { DeleteGameButton } from "@/components/DeleteGameButton";
import GamesHeader from "@/components/GamesHeader";
import type { Game, Player, Season, DraftGame } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getWinner(game: Game, players: Player[]) {
  const winnerResult = game.results.find((r) => r.position === 1);
  if (!winnerResult) return null;
  return players.find((p) => p.id === winnerResult.playerId);
}

export default function GamesPage() {
  const [season, setSeason] = useState<Season | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeDraft, setActiveDraft] = useState<DraftGame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const activeSeason = await getActiveSeason();
        setSeason(activeSeason);
        const [gamesData, playersData, draftData] = await Promise.all([
          activeSeason
            ? getGamesBySeason(activeSeason.id)
            : Promise.resolve([]),
          getPlayers(),
          getActiveDraft(),
        ]);
        setGames(gamesData);
        setPlayers(playersData);
        setActiveDraft(draftData);
      } catch (err) {
        console.error("Error loading games:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-6">
      <GamesHeader
        initialDraft={activeDraft}
        season={season}
        gameCount={season?.gameCount ?? 0}
      />

      <div className="flex flex-col gap-3">
        {games.length === 0 ? (
          <div className="bg-surface rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-text-secondary">No games logged yet.</p>
          </div>
        ) : (
          games.map((game) => {
            const winner = getWinner(game, players);
            const winnerResult = game.results.find((r) => r.position === 1);
            return (
              <div
                key={game.id}
                className="bg-surface rounded-2xl px-4 py-4 border border-gray-100 flex items-center gap-2"
              >
                <Link href={`/games/${game.id}`} className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-secondary">
                      {formatDate(game.date)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {game.playerCount} players
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">
                        {winner?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Winner
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent">
                        £{winnerResult?.prizeMoney ?? 0}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {winnerResult?.points ?? 0} pts
                      </p>
                    </div>
                  </div>
                </Link>
                <DeleteGameButton gameId={game.id} className="shrink-0 p-1" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
