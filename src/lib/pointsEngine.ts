export interface GamePlayer {
  playerId: string;
  position: number;
  knockouts: string[];
}

export interface GameResult {
  playerId: string;
  position: number;
  knockouts: string[];
  points: number;
  prizeMoney: number;
}

export interface GameSummary {
  results: GameResult[];
  potTotal: number;
  seasonPotContribution: number;
}

const BUYIN = 10;
const SEASON_POT_PCT = 0.2;
const RUNNER_UP_PCT = 0.2;
const MIN_PLAYERS_FOR_EXTRAS = 5;
const MIN_PLAYERS_FOR_RUNNER_UP_PRIZE = 4;

export function calculatePoints(
  player: GamePlayer,
  totalPlayers: number,
): number {
  let points = 0;

  if (player.position === 1) points += 8;
  if (player.position === 2) points += 4;
  if (player.position === 3 && totalPlayers >= MIN_PLAYERS_FOR_EXTRAS)
    points += 1;
  if (
    player.position === totalPlayers &&
    totalPlayers >= MIN_PLAYERS_FOR_EXTRAS
  )
    points -= 1;

  points += player.knockouts.length;

  return points;
}

export function calculatePrizeMoney(
  position: number,
  totalPlayers: number,
): number {
  const pot = totalPlayers * BUYIN;
  const seasonCut = pot * SEASON_POT_PCT;
  const remaining = pot - seasonCut;

  if (totalPlayers >= MIN_PLAYERS_FOR_RUNNER_UP_PRIZE) {
    const runnerUpPrize = pot * RUNNER_UP_PCT;
    const winnerPrize = remaining - runnerUpPrize;

    if (position === 1) return winnerPrize;
    if (position === 2) return runnerUpPrize;
    return 0;
  }

  if (position === 1) return remaining;
  return 0;
}

export function calculateSeasonPotContribution(totalPlayers: number): number {
  return totalPlayers * BUYIN * SEASON_POT_PCT;
}

export function processGame(players: GamePlayer[]): GameSummary {
  const totalPlayers = players.length;
  const potTotal = totalPlayers * BUYIN;
  const seasonPotContribution = calculateSeasonPotContribution(totalPlayers);

  const results: GameResult[] = players.map((player) => ({
    ...player,
    points: calculatePoints(player, totalPlayers),
    prizeMoney: calculatePrizeMoney(player.position, totalPlayers),
  }));

  return {
    results,
    potTotal,
    seasonPotContribution,
  };
}
