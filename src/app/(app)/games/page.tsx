import Link from "next/link";
import { getActiveSeason, getGamesBySeason, getPlayers } from "@/lib/firestore";
import type { Game, Player } from "@/types";

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

export default async function GamesPage() {
  const season = await getActiveSeason();
  const [games, players] = await Promise.all([
    season ? getGamesBySeason(season.id) : Promise.resolve([]),
    getPlayers(),
  ]);

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Games</h1>
          <h2 className="text-lg font-medium text-accent mt-0.5">
            Season {season?.number}
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            {season?.gameCount ?? 0} of 30 games played
          </p>
        </div>
        <Link
          href="/games/log"
          className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          + Log game
        </Link>
      </div>

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
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="bg-surface rounded-2xl px-4 py-4 border border-gray-100 block"
              >
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
                    <p className="text-xs text-text-secondary mt-0.5">Winner</p>
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
            );
          })
        )}
      </div>
    </div>
  );
}
