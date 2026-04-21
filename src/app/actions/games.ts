"use server";

import { saveGame, deleteGame } from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import type { Game } from "@/types";

export async function logGameAction(game: Omit<Game, "id">): Promise<void> {
  await saveGame(game);
  revalidatePath("/games");
  revalidatePath("/season");
}

export async function deleteGameAction(gameId: string): Promise<void> {
  await deleteGame(gameId);
  revalidatePath("/games");
  revalidatePath("/season");
}
