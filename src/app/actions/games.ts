"use server";

import {
  saveGame,
  deleteGame,
  createDraftGame,
  getDraftGame,
  deleteDraftGame,
  getActiveDraft,
  getActiveSeason,
} from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import { processGame } from "@/lib/pointsEngine";
import type { Game } from "@/types";
import type { GamePlayer } from "@/lib/pointsEngine";

export async function logGameAction(game: Omit<Game, "id">): Promise<void> {
  await saveGame(game);
  revalidatePath("/", "layout");
}

export async function deleteGameAction(gameId: string): Promise<void> {
  await deleteGame(gameId);
  revalidatePath("/", "layout");
}

export async function createDraftGameAction(
  seasonId: string,
  playerId: string,
): Promise<{ draftId: string }> {
  // Idempotent: return the existing draft if one is already in progress
  const existing = await getActiveDraft();
  if (existing) return { draftId: existing.id };
  const draft = await createDraftGame(seasonId, playerId);
  revalidatePath("/games");
  return { draftId: draft.id };
}

/**
 * Single server action for the gateway page: finds an existing in-progress
 * draft or creates a new one. Keeps all Firestore calls server-side so the
 * client component doesn't need to import firestore.ts.
 */
export async function getOrCreateDraftAction(
  playerId: string,
): Promise<{ draftId: string } | null> {
  const existing = await getActiveDraft();
  if (existing) return { draftId: existing.id };
  const season = await getActiveSeason();
  if (!season) return null;
  const draft = await createDraftGame(season.id, playerId);
  revalidatePath("/games");
  return { draftId: draft.id };
}

export async function confirmDraftGameAction(draftId: string): Promise<void> {
  const draft = await getDraftGame(draftId);
  if (!draft) throw new Error("Draft game not found");

  const gamePlayers: GamePlayer[] = draft.selectedPlayerIds.map((playerId) => ({
    playerId,
    position: draft.positions[playerId],
    knockouts: draft.knockouts[playerId] || [],
  }));

  const summary = processGame(gamePlayers);

  await saveGame({
    seasonId: draft.seasonId,
    date: new Date().toISOString(),
    playerCount: draft.selectedPlayerIds.length,
    potTotal: summary.potTotal,
    seasonPotContribution: summary.seasonPotContribution,
    results: summary.results,
  });

  await deleteDraftGame(draftId);
  revalidatePath("/", "layout");
}

export async function cancelDraftGameAction(draftId: string): Promise<void> {
  await deleteDraftGame(draftId);
  revalidatePath("/", "layout");
}
