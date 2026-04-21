import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

const EMAIL_DOMAIN = "@pokervillains.local";
const PIN_SUFFIX = "_PV_2024";

function padPin(pin: string): string {
  return `${pin}${PIN_SUFFIX}`;
}

function playerNameToEmail(playerName: string): string {
  return `${playerName.toLowerCase()}${EMAIL_DOMAIN}`;
}

export async function signIn(
  playerName: string,
  playerId: string,
  pin: string,
): Promise<User> {
  const email = playerNameToEmail(playerName);
  const result = await signInWithEmailAndPassword(auth, email, padPin(pin));
  // Always update displayName to ensure it's correct even if previously broken
  await updateProfile(result.user, { displayName: playerId });
  return result.user;
}

export async function registerPlayer(
  playerName: string,
  playerId: string,
  pin: string,
): Promise<User> {
  const email = playerNameToEmail(playerName);
  const result = await createUserWithEmailAndPassword(auth, email, padPin(pin));
  await updateProfile(result.user, { displayName: playerId });
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
