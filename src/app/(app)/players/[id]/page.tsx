"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPlayer,
  getActiveSeason,
  getPlayerStats,
  getGamesBySeason,
} from "@/lib/firestore";
import VillainAvatar from "@/components/VillainAvatar";
import type { Player, Season, PlayerStats, Game } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const backHref = from === "standings" ? "/standings" : "/players";
  const backLabel = from === "standings" ? "Standings" : "Players";

  const [player, setPlayer] = useState<Player | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [playerGames, setPlayerGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [playerData, seasonData] = await Promise.all([
          getPlayer(id),
          getActiveSeason(),
        ]);
        if (!playerData) {
          router.replace("/players");
          return;
        }
        setPlayer(playerData);
        setSeason(seasonData);
        if (seasonData) {
          const [statsData, gamesData] = await Promise.all([
            getPlayerStats(id, seasonData.id),
            getGamesBySeason(seasonData.id),
          ]);
          setStats(statsData);
          setPlayerGames(
            gamesData
              .filter((g) => g.results.some((r) => r.playerId === id))
              .slice(0, 5),
          );
        }
      } catch (err) {
        console.error("Error loading player:", err);
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

  if (!player) return null;

  return (
    <div className="pt-6">
      <Link
        href={backHref}
        className="text-text-secondary text-sm mb-6 flex items-center gap-1"
      >
        ← {backLabel}
      </Link>

      {/* Player header */}
      <div className="flex items-center gap-4 mb-6">
        {player.villainId ? (
          <VillainAvatar villainId={player.villainId} size={64} />
        ) : (
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-accent font-medium text-2xl">
              {player.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-medium text-text-primary">
            {player.name}
          </h1>
          <h2 className="text-lg font-medium text-accent mt-0.5">
            Season {season?.number}
          </h2>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Total points</p>
          <p className="text-2xl font-medium text-text-primary">
            {stats?.totalPoints ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Net earnings</p>
          <p
            className={`text-2xl font-medium ${(stats?.netEarnings ?? 0) >= 0 ? "text-accent" : "text-danger"}`}
          >
            {(stats?.netEarnings ?? 0) >= 0 ? "+" : ""}£
            {stats?.netEarnings ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Games played</p>
          <p className="text-2xl font-medium text-text-primary">
            {stats?.gamesPlayed ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Win rate</p>
          <p className="text-2xl font-medium text-text-primary">
            {stats?.winRate ?? 0}%
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Wins</p>
          <p className="text-2xl font-medium text-text-primary">
            {stats?.wins ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Knockouts</p>
          <p className="text-2xl font-medium text-text-primary">
            {stats?.totalKnockouts ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Avg pts/game</p>
          <p className="text-2xl font-medium text-text-primary">
            {stats?.avgPointsPerGame ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Total winnings</p>
          <p className="text-2xl font-medium text-accent">
            £{stats?.totalPrizeMoney ?? 0}
          </p>
        </div>
      </div>

      {/* Recent games */}
      {playerGames.length > 0 && (
        <>
          <h3 className="text-base font-medium text-text-primary mb-3">
            Recent games
          </h3>
          <div className="flex flex-col gap-3">
            {playerGames.map((game) => {
              const result = game.results.find((r) => r.playerId === id);
              if (!result) return null;
              const positionLabels: Record<number, string> = {
                1: "1st",
                2: "2nd",
                3: "3rd",
              };
              const label =
                positionLabels[result.position] || `${result.position}th`;
              return (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="bg-surface rounded-2xl px-4 py-4 border border-gray-100 flex items-center gap-4"
                >
                  <span
                    className={`text-sm font-medium w-8 ${result.position === 1 ? "text-accent" : "text-text-secondary"}`}
                  >
                    {label}
                  </span>
                  <span className="flex-1 text-sm text-text-secondary">
                    {formatDate(game.date)}
                  </span>
                  <span className="font-medium text-text-primary">
                    {result.points} pts
                  </span>
                  {result.prizeMoney > 0 && (
                    <span className="text-accent font-medium text-sm">
                      £{result.prizeMoney}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
