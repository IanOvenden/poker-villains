"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getActiveDraft,
  getActiveSeason,
  createDraftGame,
} from "@/lib/firestore";

export default function LogGamePage() {
  const { player, loading } = useAuth();
  const router = useRouter();
  // Prevents React Strict Mode's double-invocation from creating two draft documents
  const hasRun = useRef(false);

  useEffect(() => {
    if (loading || !player || hasRun.current) return;
    hasRun.current = true;

    async function redirectToDraft() {
      const existing = await getActiveDraft();
      if (existing) {
        router.replace(`/games/log/${existing.id}`);
        return;
      }
      const season = await getActiveSeason();
      if (!season) return;
      const draft = await createDraftGame(season.id, player!.id);
      router.replace(`/games/log/${draft.id}`);
    }

    redirectToDraft();
  }, [player, loading, router]);

  return (
    <div className="pt-6 text-center text-text-secondary text-sm">
      Setting up game…
    </div>
  );
}
