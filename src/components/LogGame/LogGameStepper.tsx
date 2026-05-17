"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToDraft,
  advanceToKnockouts,
  advanceToPositions,
  updateStep,
  updatePresence,
  removePresence,
  deleteDraftClient,
} from "@/lib/draftGame";
import { confirmDraftGameAction } from "@/app/actions/games";
import type { Player, DraftGame } from "@/types";
import SelectPlayers from "./SelectPlayers";
import RecordKnockouts from "./RecordKnockouts";
import SetPositions from "./SetPositions";
import ConfirmGame from "./ConfirmGame";
import PresenceIndicator from "./PresenceIndicator";

const STEPS: DraftGame["step"][] = [
  "select",
  "knockouts",
  "positions",
  "confirm",
];

interface Props {
  draftId: string;
  initialDraft: DraftGame;
  allPlayers: Player[];
}

export default function LogGameStepper({
  draftId,
  initialDraft,
  allPlayers,
}: Props) {
  const [draft, setDraft] = useState<DraftGame | null>(initialDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const router = useRouter();
  const { player } = useAuth();

  // Real-time subscription — only update state here, never call router inside the callback
  useEffect(() => {
    const unsubscribe = subscribeToDraft(draftId, setDraft);
    return unsubscribe;
  }, [draftId]);

  // Navigate away when the draft is deleted (by any user)
  useEffect(() => {
    if (draft === null) {
      router.replace("/games");
      router.refresh();
    }
  }, [draft, router]);

  // Presence heartbeat
  useEffect(() => {
    if (!player) return;
    const { id: playerId, name: displayName } = player;
    updatePresence(draftId, playerId, displayName);
    const interval = setInterval(() => {
      updatePresence(draftId, playerId, displayName);
    }, 30_000);
    return () => {
      clearInterval(interval);
      removePresence(draftId, playerId);
    };
  }, [draftId, player]);

  // While draft is null the navigation effect above is running — render nothing
  if (!draft) return null;

  const stepIndex = STEPS.indexOf(draft.step);
  const selectedPlayers = allPlayers.filter((p) =>
    draft.selectedPlayerIds.includes(p.id),
  );

  async function handleConfirm() {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await confirmDraftGameAction(draftId);
      router.replace("/games");
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  }

  async function handleCancel() {
    if (isDiscarding) return;
    setIsDiscarding(true);
    try {
      // Client-side deletion triggers onSnapshot for ALL connected clients instantly,
      // without waiting for a server round-trip. The useEffect watching draft===null
      // then navigates every user away simultaneously.
      await deleteDraftClient(draftId);
      router.replace("/games");
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsDiscarding(false);
    }
  }

  return (
    <div className="pt-6">
      <PresenceIndicator
        presence={draft.presence}
        currentPlayerId={player?.id ?? ""}
      />

      {/* Progress indicator */}
      <div className="flex items-center w-full mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="contents">
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                i <= stepIndex ? "bg-accent" : "bg-gray-200"
              }`}
            />
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-colors ${
                  i < stepIndex ? "bg-accent" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {draft.step === "select" && (
        <SelectPlayers
          players={allPlayers}
          selectedPlayerIds={draft.selectedPlayerIds}
          draftId={draftId}
          onNext={() => advanceToKnockouts(draftId)}
        />
      )}
      {draft.step === "knockouts" && (
        <RecordKnockouts
          players={selectedPlayers}
          knockouts={draft.knockouts}
          draftId={draftId}
          onNext={async () => {
            // Derive finishing positions from the elimination order:
            // last knocked out → 2nd place, first knocked out → last place,
            // the surviving player (never knocked out) → 1st place.
            const eliminationOrder = draft.eliminationOrder ?? [];
            const winner = selectedPlayers.find(
              (p) => !eliminationOrder.includes(p.id),
            );
            const eliminatedByRank = [...eliminationOrder].reverse();
            const ordered = [
              ...(winner ? [winner] : []),
              ...eliminatedByRank
                .map((id) => selectedPlayers.find((p) => p.id === id))
                .filter((p): p is Player => p !== undefined),
            ];
            const positions: Record<string, number> = {};
            ordered.forEach((p, i) => {
              positions[p.id] = i + 1;
            });
            await advanceToPositions(draftId, positions);
          }}
          onBack={() => updateStep(draftId, "select")}
        />
      )}
      {draft.step === "positions" && (
        <SetPositions
          players={selectedPlayers}
          knockouts={draft.knockouts}
          positions={draft.positions}
          draftId={draftId}
          onNext={() => updateStep(draftId, "confirm")}
          onBack={() => updateStep(draftId, "knockouts")}
        />
      )}
      {draft.step === "confirm" && (
        <ConfirmGame
          selectedPlayers={selectedPlayers}
          knockouts={draft.knockouts}
          positions={draft.positions}
          isSaving={isSaving}
          onConfirm={handleConfirm}
          onBack={() => updateStep(draftId, "positions")}
        />
      )}

      <button
        onClick={handleCancel}
        disabled={isDiscarding || isSaving}
        className="mt-6 w-full py-3 text-sm text-text-secondary border border-gray-200 rounded-2xl disabled:opacity-40"
      >
        {isDiscarding ? "Discarding…" : "Discard game"}
      </button>
    </div>
  );
}
