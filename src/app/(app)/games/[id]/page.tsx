"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getGame, getPlayers, getGamesBySeason } from "@/lib/firestore";
import { DeleteGameButton } from "@/components/DeleteGameButton";
import { GameNav } from "@/components/GameNav";
import type { Game, Player } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const positionLabels: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };
function getLabel(pos: number) {
  return positionLabels[pos] || `${pos}th`;
}

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [seasonGames, setSeasonGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [gameData, playersData] = await Promise.all([
          getGame(id),
          getPlayers(),
        ]);
        if (!gameData) {
          router.replace("/games");
          return;
        }
        // Use the game's own seasonId so navigation stays within the correct season,
        // even if this game belongs to a completed season rather than the active one.
        // getGamesBySeason returns date desc; reverse for chronological order so
        // game index 0 = oldest (Game 1) and index N-1 = newest (Game N).
        const allSeasonGames = (
          await getGamesBySeason(gameData.seasonId)
        ).reverse();
        setGame(gameData);
        setPlayers(playersData);
        setSeasonGames(allSeasonGames);
      } catch (err) {
        console.error("Error loading game:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) return null;

  const currentIndex = seasonGames.findIndex((g) => g.id === id);
  const total = seasonGames.length;
  const gameNumber = currentIndex + 1;

  const prevId =
    total > 1 ? seasonGames[(currentIndex - 1 + total) % total].id : id;
  const nextId = total > 1 ? seasonGames[(currentIndex + 1) % total].id : id;

  const playerMap = Object.fromEntries(players.map((p: Player) => [p.id, p]));
  const sortedResults = [...game.results].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <>
      <div className="pt-6 pb-24">
        <Link
          href="/games"
          className="text-text-secondary text-sm mb-6 flex items-center gap-1"
        >
          ← Games
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-text-primary">
              Game result
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {formatDate(game.date)}
            </p>
          </div>
          <DeleteGameButton
            gameId={game.id}
            redirectAfter
            className="p-1 mt-1"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-surface rounded-2xl p-3 border border-gray-100 text-center">
            <p className="text-xs text-text-secondary mb-1">Players</p>
            <p className="font-medium text-text-primary">{game.playerCount}</p>
          </div>
          <div className="bg-surface rounded-2xl p-3 border border-gray-100 text-center">
            <p className="text-xs text-text-secondary mb-1">Total pot</p>
            <p className="font-medium text-text-primary">£{game.potTotal}</p>
          </div>
          <div className="bg-surface rounded-2xl p-3 border border-gray-100 text-center">
            <p className="text-xs text-text-secondary mb-1">Season pot</p>
            <p className="font-medium text-accent">
              £{game.seasonPotContribution}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-3">
          {sortedResults.map((result) => {
            const player = playerMap[result.playerId];
            return (
              <div
                key={result.playerId}
                className="bg-surface rounded-2xl px-4 py-4 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-sm font-medium w-8 ${
                      result.position === 1
                        ? "text-accent"
                        : "text-text-secondary"
                    }`}
                  >
                    {getLabel(result.position)}
                  </span>
                  <span className="flex-1 font-medium text-text-primary">
                    {player?.name ?? "Unknown"}
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
                    Knocked out:{" "}
                    {result.knockouts
                      .map((kid) => playerMap[kid]?.name ?? kid)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {total > 1 && (
        <GameNav
          prevId={prevId}
          nextId={nextId}
          gameNumber={gameNumber}
          totalGames={total}
        />
      )}
    </>
  );
}
