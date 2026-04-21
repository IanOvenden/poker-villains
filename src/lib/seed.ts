import { config } from "dotenv";
config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const players = [
  { name: "Ian", avatarId: "shark" },
  { name: "Isaac", avatarId: "hustler" },
  { name: "Luke", avatarId: "ghost" },
  { name: "Dave", avatarId: "gunslinger" },
  { name: "Emma", avatarId: "viper" },
  { name: "Simon", avatarId: "don" },
];

async function seed() {
  console.log("Seeding Firestore...");

  const existingPlayers = await getDocs(collection(db, "players"));
  if (!existingPlayers.empty) {
    console.log("Players already seeded — skipping.");
  } else {
    for (const player of players) {
      await addDoc(collection(db, "players"), {
        ...player,
        createdAt: new Date().toISOString(),
      });
      console.log(`Added player: ${player.name}`);
    }
  }

  const existingSeason = await getDocs(
    query(collection(db, "seasons"), where("status", "==", "active")),
  );
  if (!existingSeason.empty) {
    console.log("Season already exists — skipping.");
  } else {
    await addDoc(collection(db, "seasons"), {
      number: 1,
      status: "active",
      gameCount: 0,
      potTotal: 0,
      startDate: new Date().toISOString(),
    });
    console.log("Created Season 1.");
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
