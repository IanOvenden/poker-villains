"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPlayers, getSeasonSummary } from "@/lib/firestore";
import type { Game, PlayerStats, Player, Season } from "@/types";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function SeasonDetailPage() {
  const params = useParams<{ id: string }>();
  const [season, setSeason] = useState<Season | null>(null);
  const [standings, setStandings] = useState<PlayerStats[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [payouts, setPayouts] = useState<{
    winnerName: string | null;
    winnerPayout: number;
    runnerUpName: string | null;
    runnerUpPayout: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!params?.id) return;

      try {
        const [summary, playersData] = await Promise.all([
          getSeasonSummary(params.id),
          getPlayers(),
        ]);

        if (!summary) {
          setSeason(null);
          setStandings([]);
          setGames([]);
          setPayouts(null);
          setPlayers([]);
          return;
        }

        setSeason(summary.season);
        setStandings(summary.standings);
        setGames(summary.games);
        setPlayers(playersData);
        setPayouts(summary.payouts);
      } catch (error) {
        console.error("Error loading season detail:", error);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!season) {
    return (
      <div className="flex items-center justify-center pt-20">
        <p className="text-text-secondary">Season not found.</p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-text-primary">Season {season.number}</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          {formatDate(season.startDate)} to {formatDate(season.endDate)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl border border-gray-100 bg-surface p-4">
          <p className="text-xs text-text-secondary">Games played</p>
          <p className="text-2xl font-medium text-text-primary">{season.gameCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-surface p-4">
          <p className="text-xs text-text-secondary">Pot total</p>
          <p className="text-2xl font-medium text-accent">{formatCurrency(season.potTotal)}</p>
        </div>
      </div>

      {payouts && (
        <>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 mb-4">
            <p className="text-xs text-text-secondary">Champion</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-medium text-text-primary">{payouts.winnerName ?? "—"}</p>
                <p className="text-xs text-text-secondary">Winner of Season {season.number}</p>
              </div>
              <p className="text-lg font-medium text-accent">{formatCurrency(payouts.winnerPayout)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-surface p-4 mb-4">
            <h2 className="text-sm font-medium text-text-primary mb-3">Payout summary</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-secondary">1st place (75%)</p>
                  <p className="font-medium text-text-primary">{payouts.winnerName ?? "—"}</p>
                </div>
                <p className="font-medium text-accent">{formatCurrency(payouts.winnerPayout)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-secondary">2nd place (25%)</p>
                  <p className="font-medium text-text-primary">{payouts.runnerUpName ?? "—"}</p>
                </div>
                <p className="font-medium text-text-primary">{formatCurrency(payouts.runnerUpPayout)}</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="rounded-2xl border border-gray-100 bg-surface p-4 mb-4">
        <h2 className="text-sm font-medium text-text-primary mb-3">Final standings</h2>
        <div className="flex flex-col gap-3">
          {standings.length === 0 ? (
            <p className="text-text-secondary text-sm">No standings available.</p>
          ) : (
            standings.map((player, index) => (
              <div key={player.playerId} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-text-primary">
                    {index + 1}. {player.name}
                  </p>
                  <p className="text-xs text-text-secondary">{player.totalPoints} pts · {player.wins} wins</p>
                </div>
                <p className="font-medium text-accent">{player.netEarnings >= 0 ? "+" : ""}{formatCurrency(player.netEarnings)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-surface p-4">
        <h2 className="text-sm font-medium text-text-primary mb-3">Games</h2>
        <div className="flex flex-col gap-2">
          {games.length === 0 ? (
            <p className="text-text-secondary text-sm">No games recorded for this season.</p>
          ) : (
            games.map((game) => {
              const winnerResult = game.results.find((result) => result.position === 1);
              const winnerName = winnerResult
                ? players.find((player) => player.id === winnerResult.playerId)?.name ?? "Unknown"
                : "—";
              return (
                <div key={game.id} className="rounded-xl border border-gray-100 p-3">
                  <p className="text-sm font-medium text-text-primary">{formatDate(game.date)}</p>
                  <p className="text-xs text-text-secondary">
                    Winner: {winnerName} · {winnerResult?.prizeMoney ?? 0} prize
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
