import { getGame, getPlayers } from "@/lib/firestore";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DeleteGameButton } from "@/components/DeleteGameButton";
import type { Player } from "@/types";

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

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [game, players] = await Promise.all([getGame(id), getPlayers()]);

  if (!game) notFound();

  const playerMap = Object.fromEntries(players.map((p: Player) => [p.id, p]));
  const sortedResults = [...game.results].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <div className="pt-6">
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
        <DeleteGameButton gameId={game.id} redirectAfter className="p-1 mt-1" />
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
                    .map((id) => playerMap[id]?.name ?? id)
                    .join(", ")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
