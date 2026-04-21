import Link from "next/link";
import { getPlayers, getActiveSeason, getPlayerStats } from "@/lib/firestore";
import VillainAvatar from "@/components/VillainAvatar";

export default async function PlayersPage() {
  const [players, season] = await Promise.all([
    getPlayers(),
    getActiveSeason(),
  ]);

  const stats = season
    ? await Promise.all(players.map((p) => getPlayerStats(p.id, season.id)))
    : [];

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-text-primary">Players</h1>
        <h2 className="text-lg font-medium text-accent mt-0.5">
          Season {season?.number}
        </h2>
        <p className="text-text-secondary text-sm mt-0.5">
          {players.length} players in the league
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {players.map((player, index) => {
          const playerStats = stats[index];
          return (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="bg-surface rounded-2xl px-4 py-4 border border-gray-100 flex items-center gap-4"
            >
              {player.villainId ? (
                <VillainAvatar villainId={player.villainId} size={48} />
              ) : (
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-medium text-lg">
                    {player.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-text-primary">{player.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {playerStats?.gamesPlayed ?? 0}{" "}
                  {playerStats?.gamesPlayed === 1 ? "game" : "games"} ·{" "}
                  {playerStats?.wins ?? 0}{" "}
                  {playerStats?.wins === 1 ? "win" : "wins"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-text-primary">
                  {playerStats?.totalPoints ?? 0} pts
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    (playerStats?.netEarnings ?? 0) >= 0
                      ? "text-accent"
                      : "text-danger"
                  }`}
                >
                  {(playerStats?.netEarnings ?? 0) >= 0 ? "+" : ""}£
                  {playerStats?.netEarnings ?? 0}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
