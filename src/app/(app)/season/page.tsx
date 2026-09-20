"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createNextSeason,
  finalizeSeason,
  getActiveSeason,
  getSeasonStandings,
} from "@/lib/firestore";
import PostponeSchedule from "@/components/PostponeSchedule";
import { buildSchedule } from "@/lib/schedule";
import { canFinalizeSeason } from "@/lib/seasonLifecycle";
import type { Season, PlayerStats } from "@/types";

const GAMES_IN_SEASON = 30;
const BUYIN = 10;

function formatCurrency(amount: number) {
  return `£${amount.toFixed(2)}`;
}

export default function SeasonPage() {
  const [season, setSeason] = useState<Season | null>(null);
  const [standings, setStandings] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<{
    type: "finalize" | "next" | null;
    loading: boolean;
    error: string | null;
  }>({ type: null, loading: false, error: null });

  const load = useCallback(async () => {
    try {
      const activeSeason = await getActiveSeason();
      setSeason(activeSeason);
      if (activeSeason) {
        const standingsData = await getSeasonStandings(activeSeason.id);
        setStandings(standingsData);
      }
    } catch (err) {
      console.error("Error loading season:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleFinalizeSeason() {
    if (!season) return;
    setActionState({ type: "finalize", loading: true, error: null });

    try {
      await finalizeSeason(season.id);
      await load();
    } catch (err) {
      console.error("Error finalizing season:", err);
      setActionState({
        type: "finalize",
        loading: false,
        error: err instanceof Error ? err.message : "Failed to finalize season.",
      });
      return;
    }

    setActionState({ type: null, loading: false, error: null });
  }

  async function handleCreateNextSeason() {
    setActionState({ type: "next", loading: true, error: null });

    try {
      const nextSeason = await createNextSeason();
      setSeason(nextSeason);
      const standingsData = await getSeasonStandings(nextSeason.id);
      setStandings(standingsData);
    } catch (err) {
      console.error("Error creating next season:", err);
      setActionState({
        type: "next",
        loading: false,
        error: err instanceof Error ? err.message : "Failed to start next season.",
      });
      return;
    }

    setActionState({ type: null, loading: false, error: null });
  }

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
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-surface p-6 text-center">
          <h1 className="text-2xl font-medium text-text-primary">No active season</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Start the next season to begin tracking standings, games, and payouts.
          </p>
          <button
            type="button"
            onClick={handleCreateNextSeason}
            disabled={actionState.loading}
            className="mt-4 w-full rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {actionState.loading && actionState.type === "next"
              ? "Starting season..."
              : "Start next season"}
          </button>
        </div>
      </div>
    );
  }

  const gamesPlayed = season.gameCount;
  const gamesRemaining = GAMES_IN_SEASON - gamesPlayed;
  const canFinalize = canFinalizeSeason(season, GAMES_IN_SEASON);
  const potTotal = season?.potTotal ?? 0;
  const projectedPot = potTotal + gamesRemaining * BUYIN * 0.2 * 6;

  const topTwo = standings.slice(0, 2);
  const winner = topTwo[0];
  const runnerUp = topTwo[1];

  const winnerPayout = potTotal * 0.75;
  const runnerUpPayout = potTotal * 0.25;

  const progressPct = Math.round((gamesPlayed / GAMES_IN_SEASON) * 100);
  const sessionCount = season?.startDate
    ? buildSchedule(
        season.startDate,
        gamesPlayed,
        GAMES_IN_SEASON,
        season.sessionOverrides,
      ).length
    : GAMES_IN_SEASON / 2;

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-text-primary">Season</h1>
        <h2 className="text-lg font-medium text-accent mt-0.5">
          Season {season?.number}
        </h2>
        <p className="text-text-secondary text-sm mt-0.5">
          {gamesPlayed} of {GAMES_IN_SEASON} games played
        </p>
      </div>

      {season && canFinalize && (
        <div className="mb-4 flex gap-3">
          <button
            type="button"
            onClick={handleFinalizeSeason}
            disabled={actionState.loading}
            className="flex-1 rounded-xl bg-accent text-white px-3 py-2 text-sm font-medium disabled:opacity-60"
          >
            {actionState.loading && actionState.type === "finalize"
              ? "Finalizing..."
              : "Finalize season"}
          </button>

          <button
            type="button"
            onClick={handleCreateNextSeason}
            disabled={actionState.loading}
            className="flex-1 rounded-xl border border-gray-200 bg-surface px-3 py-2 text-sm font-medium text-text-primary disabled:opacity-60"
          >
            {actionState.loading && actionState.type === "next"
              ? "Starting..."
              : "Start next season"}
          </button>
        </div>
      )}

      {actionState.error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {actionState.error}
        </p>
      )}

      {/* Progress bar */}
      <div className="bg-surface rounded-2xl p-4 border border-gray-100 mb-4">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Season progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-secondary mt-2">
          <span>{gamesPlayed} played</span>
          <span>{gamesRemaining} remaining</span>
        </div>
      </div>

      {/* Season pot */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Current pot</p>
          <p className="text-2xl font-medium text-accent">
            {formatCurrency(potTotal)}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Projected pot</p>
          <p className="text-2xl font-medium text-text-primary">
            {formatCurrency(projectedPot)}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            if all 6 play every game
          </p>
        </div>
      </div>

      {/* Payout breakdown */}
      <div className="bg-surface rounded-2xl p-4 border border-gray-100 mb-4">
        <h3 className="text-sm font-medium text-text-primary mb-3">
          Current payout if season ended today
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary mb-0.5">
                1st place (75%)
              </p>
              <p className="font-medium text-text-primary">
                {winner?.name ?? "—"}
              </p>
            </div>
            <p className="font-medium text-accent">
              {formatCurrency(winnerPayout)}
            </p>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary mb-0.5">
                2nd place (25%)
              </p>
              <p className="font-medium text-text-primary">
                {runnerUp?.name ?? "—"}
              </p>
            </div>
            <p className="font-medium text-text-primary">
              {formatCurrency(runnerUpPayout)}
            </p>
          </div>
        </div>
      </div>

      {/* Tiebreaker note */}
      <div className="bg-surface rounded-2xl p-4 border border-gray-100 mb-4">
        <h3 className="text-sm font-medium text-text-primary mb-1">
          Tiebreaker rule
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          If two players finish the season level on points, the winner is
          determined by win rate (wins per game played) rather than total wins.
        </p>
      </div>

      {/* Schedule */}
      {season?.startDate && (
        <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 pt-4 pb-3">
            <h3 className="text-sm font-medium text-text-primary">Schedule</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {sessionCount} sessions · every other Sunday
            </p>
          </div>
          <PostponeSchedule
            seasonId={season.id}
            startDate={season.startDate}
            gameCount={gamesPlayed}
            totalGames={GAMES_IN_SEASON}
            initialOverrides={season.sessionOverrides}
          />
        </div>
      )}
    </div>
  );
}
