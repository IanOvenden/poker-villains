"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrCreateDraftAction } from "@/app/actions/games";

export default function LogGamePage() {
  const { player, loading } = useAuth();
  const router = useRouter();
  // Prevents React Strict Mode's double-invocation from creating two draft documents
  const hasRun = useRef(false);

  useEffect(() => {
    if (loading || !player || hasRun.current) return;
    hasRun.current = true;

    async function redirectToDraft() {
      const result = await getOrCreateDraftAction(player!.id);
      if (!result) return;
      router.replace(`/games/log/${result.draftId}`);
    }

    redirectToDraft();
  }, [player, loading, router]);

  return (
    <div className="pt-6 text-center text-text-secondary text-sm">
      Setting up game…
    </div>
  );
}
