"use server";

import { deleteGame } from "@/lib/firestore";
import { revalidatePath } from "next/cache";

export async function deleteGameAction(gameId: string): Promise<void> {
  await deleteGame(gameId);
  revalidatePath("/games");
}
