import { getActiveSeason, getSeasonStandings } from "@/lib/firestore";
import PostponeSchedule from "@/components/PostponeSchedule";
import { buildSchedule } from "@/lib/schedule";

const GAMES_IN_SEASON = 30;
const BUYIN = 10;

function formatCurrency(amount: number) {
  return `£${amount.toFixed(2)}`;
}

export default async function SeasonPage() {
  const season = await getActiveSeason();
  const standings = season ? await getSeasonStandings(season.id) : [];

  const gamesPlayed = season?.gameCount ?? 0;
  const gamesRemaining = GAMES_IN_SEASON - gamesPlayed;
  const potTotal = season?.potTotal ?? 0;
  const projectedPot = potTotal + gamesRemaining * BUYIN * 0.2 * 6;

  const topTwo = standings.slice(0, 2);
  const winner = topTwo[0];
  const runnerUp = topTwo[1];

  const winnerPayout = potTotal * 0.75;
  const runnerUpPayout = potTotal * 0.25;

  const progressPct = Math.round((gamesPlayed / GAMES_IN_SEASON) * 100);
  const sessionCount = season?.startDate
    ? buildSchedule(season.startDate, gamesPlayed, GAMES_IN_SEASON, season.sessionOverrides).length
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
