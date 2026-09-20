"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCompletedSeasons } from "@/lib/firestore";
import type { Season } from "@/types";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  const recentSeason = seasons[0] ?? null;

  useEffect(() => {
    async function load() {
      try {
        const data = await getCompletedSeasons();
        setSeasons(data);
      } catch (error) {
        console.error("Error loading seasons:", error);
      } finally {
        setLoading(false);
      }
    }

    void load();
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
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-text-primary">Seasons</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Completed seasons and historical results
        </p>
      </div>

      {recentSeason && (
        <div className="mb-4 rounded-2xl border border-gray-100 bg-surface p-4">
          <p className="text-xs text-text-secondary">Archive overview</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-text-secondary">Completed seasons</p>
              <p className="text-2xl font-medium text-text-primary">{seasons.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Latest</p>
              <p className="font-medium text-accent">Season {recentSeason.number}</p>
            </div>
          </div>
        </div>
      )}

      {seasons.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-surface p-8 text-center text-text-secondary">
          No completed seasons yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {seasons.map((season) => (
            <Link
              key={season.id}
              href={`/seasons/${season.id}`}
              className="rounded-2xl border border-gray-100 bg-surface px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-text-secondary">Season {season.number}</p>
                  <p className="text-lg font-medium text-text-primary mt-0.5">
                    {formatDate(season.startDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary">Games</p>
                  <p className="font-medium text-text-primary">{season.gameCount}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-text-secondary">
                <span>Finished</span>
                <span>{formatDate(season.endDate)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
