"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveSeason, getSeasonStandings } from "@/lib/firestore";
import { getNextSession, formatSessionDate } from "@/lib/schedule";
import type { SessionInfo } from "@/lib/schedule";
import type { PlayerStats, Season } from "@/types";

export default function StandingsPage() {
  const [season, setSeason] = useState<Season | null>(null);
  const [standings, setStandings] = useState<PlayerStats[]>([]);
  const [nextSession, setNextSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const activeSeason = await getActiveSeason();
        if (activeSeason) {
          setSeason(activeSeason);
          const [data] = await Promise.all([getSeasonStandings(activeSeason.id)]);
          setStandings(data);
          if (activeSeason.startDate) {
            setNextSession(
              getNextSession(activeSeason.startDate, activeSeason.gameCount, 30, activeSeason.sessionOverrides)
            );
          }
        }
      } catch (err) {
        console.error("Error loading standings:", err);
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

  if (!season) {
    return (
      <div className="flex items-center justify-center pt-20">
        <p className="text-text-secondary">No active season found.</p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-text-primary">Standings</h1>
        <h2 className="text-lg font-medium text-accent mt-0.5">
          Season {season.number}
        </h2>
        <p className="text-text-secondary text-sm mt-0.5">
          {season.gameCount} of 30 games played
        </p>
      </div>

      {nextSession && (
        <Link
          href="/season"
          className="flex items-center justify-between bg-accent text-white rounded-2xl px-4 py-4 mb-6"
        >
          <div>
            <p className="text-xs font-medium opacity-75 uppercase tracking-wide">
              Next game night
            </p>
            <p className="text-2xl font-semibold mt-0.5">
              {formatSessionDate(nextSession.date)}
            </p>
            <p className="text-xs opacity-75 mt-0.5">
              Session {nextSession.sessionNumber} · Games {nextSession.game1} &amp; {nextSession.game2}
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 opacity-75 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      <div className="flex flex-col gap-3">
        {standings.length === 0 ? (
          <div className="bg-surface rounded-2xl p-8 text-center">
            <p className="text-text-secondary">
              No games played yet this season.
            </p>
          </div>
        ) : (
          standings.map((player, index) => (
            <Link
              key={player.playerId}
              href={`/players/${player.playerId}?from=standings`}
              className="bg-surface rounded-2xl px-4 py-4 flex items-center gap-4 border border-gray-100"
            >
              <span
                className={`text-lg font-medium w-6 text-center ${
                  index === 0 ? "text-accent" : "text-text-secondary"
                }`}
              >
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-text-primary">{player.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {player.gamesPlayed} games · {player.wins} wins ·{" "}
                  {player.winRate}% win rate
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-text-primary">
                  {player.totalPoints} pts
                </p>
                <p
                  className={`text-xs mt-0.5 ${player.netEarnings >= 0 ? "text-accent" : "text-danger"}`}
                >
                  {player.netEarnings >= 0 ? "+" : ""}£{player.netEarnings}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
