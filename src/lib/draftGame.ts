import {
  doc,
  collection,
  updateDoc,
  deleteDoc,
  onSnapshot,
  deleteField,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase";
import type { DraftGame } from "@/types";

const COLLECTION = "draft_games";

export function subscribeToDraft(
  draftId: string,
  callback: (draft: DraftGame | null) => void,
): () => void {
  const ref = doc(db, COLLECTION, draftId);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback({ id: snap.id, ...snap.data() } as DraftGame);
    }
  });
}

/** Subscribe to the draft_games collection. Fires with the first draft or null. */
export function subscribeToDraftCollection(
  callback: (draft: DraftGame | null) => void,
): () => void {
  const ref = collection(db, COLLECTION);
  return onSnapshot(ref, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
    } else {
      const docSnap = snapshot.docs[0];
      callback({ id: docSnap.id, ...docSnap.data() } as DraftGame);
    }
  });
}

export async function addPlayerToSelection(
  draftId: string,
  playerId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), {
    selectedPlayerIds: arrayUnion(playerId),
  });
}

export async function removePlayerFromSelection(
  draftId: string,
  playerId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), {
    selectedPlayerIds: arrayRemove(playerId),
  });
}

/** Advance from Select → Knockouts, resetting any prior KO + position data. */
export async function advanceToKnockouts(draftId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), {
    step: "knockouts",
    knockouts: {},
    eliminationOrder: [],
    positions: {},
  });
}

/**
 * Toggle a knockout and atomically maintain the eliminationOrder array.
 * Adding a victim appends them to eliminationOrder; removing undoes that.
 */
export async function recordKnockout(
  draftId: string,
  knockerId: string,
  currentVictims: string[],
  victimId: string,
): Promise<void> {
  const isRemoving = currentVictims.includes(victimId);
  const updatedVictims = isRemoving
    ? currentVictims.filter((id) => id !== victimId)
    : [...currentVictims, victimId];
  await updateDoc(doc(db, COLLECTION, draftId), {
    [`knockouts.${knockerId}`]: updatedVictims,
    eliminationOrder: isRemoving ? arrayRemove(victimId) : arrayUnion(victimId),
  });
}

/**
 * Advance from Knockouts → Positions, writing the derived positions and
 * changing the step in a single atomic write.
 */
export async function advanceToPositions(
  draftId: string,
  positions: Record<string, number>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), {
    step: "positions",
    positions,
  });
}

/** General step setter for Back navigation and simple advances. */
export async function updateStep(
  draftId: string,
  step: DraftGame["step"],
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), { step });
}

export async function setKnockoutsForPlayer(
  draftId: string,
  playerId: string,
  victims: string[],
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), {
    [`knockouts.${playerId}`]: victims,
  });
}

export async function setAllPositions(
  draftId: string,
  positions: Record<string, number>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), { positions });
}

export async function updatePresence(
  draftId: string,
  playerId: string,
  displayName: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, draftId), {
    [`presence.${playerId}`]: {
      displayName,
      lastSeen: new Date().toISOString(),
    },
  });
}

export async function removePresence(
  draftId: string,
  playerId: string,
): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION, draftId), {
      [`presence.${playerId}`]: deleteField(),
    });
  } catch (err: unknown) {
    // Document may already be deleted (e.g. draft was cancelled); safe to ignore.
    if ((err as { code?: string }).code !== "not-found") throw err;
  }
}

export async function deleteDraftClient(draftId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, draftId));
}
