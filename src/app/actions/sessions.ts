"use server";

import { setSessionOverride, removeSessionOverride } from "@/lib/firestore";
import { revalidatePath } from "next/cache";
import type { SessionOverride } from "@/types";

export async function setSessionOverrideAction(
  seasonId: string,
  sessionIndex: number,
  override: SessionOverride
): Promise<void> {
  await setSessionOverride(seasonId, sessionIndex, override);
  revalidatePath("/season");
}

export async function removeSessionOverrideAction(
  seasonId: string,
  sessionIndex: number
): Promise<void> {
  await removeSessionOverride(seasonId, sessionIndex);
  revalidatePath("/season");
}
