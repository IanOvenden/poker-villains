export * from "./firebase";

export interface PlayerStats {
  playerId: string;
  name: string;
  villainId?: string;
  gamesPlayed: number;
  wins: number;
  runnerUps: number;
  thirdPlaces: number;
  totalPoints: number;
  avgPointsPerGame: number;
  winRate: number;
  totalKnockouts: number;
  totalPrizeMoney: number;
  totalBuyIn: number;
  netEarnings: number;
}
