"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDraftGame, getPlayers } from "@/lib/firestore";
import LogGameStepper from "@/components/LogGame/LogGameStepper";
import type { Player, DraftGame } from "@/types";

export default function DraftGamePage() {
  const { draftId } = useParams<{ draftId: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState<DraftGame | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [draftData, playersData] = await Promise.all([
          getDraftGame(draftId),
          getPlayers(),
        ]);
        if (!draftData) {
          router.replace("/games");
          return;
        }
        setDraft(draftData);
        setAllPlayers(playersData);
      } catch (err) {
        console.error("Error loading draft:", err);
        router.replace("/games");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [draftId, router]);

  if (loading || !draft) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LogGameStepper
      draftId={draft.id}
      initialDraft={draft}
      allPlayers={allPlayers}
    />
  );
}
