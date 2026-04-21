import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Season, Player, Game, PlayerStats } from "@/types";

const BUYIN = 10;

// --- Seasons ---

export async function getActiveSeason(): Promise<Season | null> {
  const q = query(collection(db, "seasons"), where("status", "==", "active"));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Season;
}

export async function createSeason(number: number): Promise<Season> {
  const data = {
    number,
    status: "active",
    gameCount: 0,
    potTotal: 0,
    startDate: new Date().toISOString(),
  };
  const ref = await addDoc(collection(db, "seasons"), data);
  return { id: ref.id, ...data } as Season;
}

// --- Players ---

export async function getPlayers(): Promise<Player[]> {
  const snapshot = await getDocs(
    query(collection(db, "players"), orderBy("name")),
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Player);
}

export async function getPlayer(id: string): Promise<Player | null> {
  const docSnap = await getDoc(doc(db, "players", id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Player;
}

// --- Games ---

export async function getGamesBySeason(seasonId: string): Promise<Game[]> {
  const q = query(
    collection(db, "games"),
    where("seasonId", "==", seasonId),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Game);
}

export async function getGame(id: string): Promise<Game | null> {
  const docSnap = await getDoc(doc(db, "games", id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Game;
}

export async function saveGame(game: Omit<Game, "id">): Promise<Game> {
  const ref = await addDoc(collection(db, "games"), game);

  const season = await getDoc(doc(db, "seasons", game.seasonId));
  if (season.exists()) {
    const data = season.data();
    await updateDoc(doc(db, "seasons", game.seasonId), {
      gameCount: (data.gameCount || 0) + 1,
      potTotal: (data.potTotal || 0) + game.seasonPotContribution,
    });
  }

  return { id: ref.id, ...game };
}

export async function deleteGame(gameId: string): Promise<void> {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (!gameSnap.exists()) return;

  const game = gameSnap.data() as Omit<Game, "id">;
  await deleteDoc(gameRef);

  const seasonRef = doc(db, "seasons", game.seasonId);
  const seasonSnap = await getDoc(seasonRef);
  if (seasonSnap.exists()) {
    const data = seasonSnap.data();
    await updateDoc(seasonRef, {
      gameCount: Math.max(0, (data.gameCount || 0) - 1),
      potTotal: Math.max(0, (data.potTotal || 0) - game.seasonPotContribution),
    });
  }
}

// --- Stats ---

export async function getPlayerStats(
  playerId: string,
  seasonId: string,
): Promise<PlayerStats | null> {
  const [player, games] = await Promise.all([
    getPlayer(playerId),
    getGamesBySeason(seasonId),
  ]);

  if (!player) return null;

  const playerGames = games.filter((g) =>
    g.results.some((r) => r.playerId === playerId),
  );

  if (playerGames.length === 0) {
    return {
      playerId,
      name: player.name,
      villainId: player.villainId,
      gamesPlayed: 0,
      wins: 0,
      runnerUps: 0,
      thirdPlaces: 0,
      totalPoints: 0,
      avgPointsPerGame: 0,
      winRate: 0,
      totalKnockouts: 0,
      totalPrizeMoney: 0,
      totalBuyIn: 0,
      netEarnings: 0,
    };
  }

  let wins = 0;
  let runnerUps = 0;
  let thirdPlaces = 0;
  let totalPoints = 0;
  let totalKnockouts = 0;
  let totalPrizeMoney = 0;

  for (const game of playerGames) {
    const result = game.results.find((r) => r.playerId === playerId);
    if (!result) continue;
    if (result.position === 1) wins++;
    if (result.position === 2) runnerUps++;
    if (result.position === 3) thirdPlaces++;
    totalPoints += result.points;
    totalKnockouts += result.knockouts.length;
    totalPrizeMoney += result.prizeMoney;
  }

  const gamesPlayed = playerGames.length;
  const totalBuyIn = gamesPlayed * BUYIN;

  return {
    playerId,
    name: player.name,
    villainId: player.villainId,
    gamesPlayed,
    wins,
    runnerUps,
    thirdPlaces,
    totalPoints,
    avgPointsPerGame: Math.round((totalPoints / gamesPlayed) * 10) / 10,
    winRate: Math.round((wins / gamesPlayed) * 100),
    totalKnockouts,
    totalPrizeMoney,
    totalBuyIn,
    netEarnings: totalPrizeMoney - totalBuyIn,
  };
}

export async function getSeasonStandings(
  seasonId: string,
): Promise<PlayerStats[]> {
  const players = await getPlayers();
  const standings = await Promise.all(
    players.map((p) => getPlayerStats(p.id, seasonId)),
  );

  return standings
    .filter((s): s is PlayerStats => s !== null)
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return b.winRate - a.winRate;
    });
}

export async function updatePlayerVillain(
  playerId: string,
  villainId: string,
): Promise<void> {
  await updateDoc(doc(db, "players", playerId), { villainId });
}

export async function getPlayerByAuthUid(uid: string): Promise<Player | null> {
  const q = query(collection(db, "players"), where("authUid", "==", uid));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Player;
}
