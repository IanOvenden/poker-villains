"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getActiveSeason, saveGame } from "@/lib/firestore";
import { processGame } from "@/lib/pointsEngine";
import type { Player } from "@/types";
import type { GamePlayer } from "@/lib/pointsEngine";
import SelectPlayers from "./SelectPlayers";
import RecordKnockouts from "./RecordKnockouts";
import SetPositions from "./SetPositions";
import ConfirmGame from "./ConfirmGame";

export type LogGameStep = "select" | "knockouts" | "positions" | "confirm";

export interface LogGameState {
  selectedPlayers: Player[];
  knockouts: Record<string, string[]>;
  positions: Record<string, number>;
}

const INITIAL_STATE: LogGameState = {
  selectedPlayers: [],
  knockouts: {},
  positions: {},
};

export default function LogGameStepper({ players }: { players: Player[] }) {
  const [step, setStep] = useState<LogGameStep>("select");
  const [state, setState] = useState<LogGameState>(INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const steps: LogGameStep[] = ["select", "knockouts", "positions", "confirm"];
  const stepIndex = steps.indexOf(step);

  function handleSelectPlayers(selectedPlayers: Player[]) {
    setState({ ...INITIAL_STATE, selectedPlayers });
    setStep("knockouts");
  }

  function handleKnockouts(knockouts: Record<string, string[]>) {
    setState((s) => ({ ...s, knockouts }));
    setStep("positions");
  }

  function handlePositions(positions: Record<string, number>) {
    setState((s) => ({ ...s, positions }));
    setStep("confirm");
  }

  async function handleConfirm() {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const season = await getActiveSeason();
      if (!season) throw new Error("No active season");

      const gamePlayers: GamePlayer[] = state.selectedPlayers.map((p) => ({
        playerId: p.id,
        position: state.positions[p.id],
        knockouts: state.knockouts[p.id] || [],
      }));

      const summary = processGame(gamePlayers);

      await saveGame({
        seasonId: season.id,
        date: new Date().toISOString(),
        playerCount: state.selectedPlayers.length,
        potTotal: summary.potTotal,
        seasonPotContribution: summary.seasonPotContribution,
        results: summary.results,
      });

      router.replace("/games");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="pt-6">
      {/* Progress indicator */}
      <div className="flex items-center w-full mb-8">
        {steps.map((s, i) => (
          <div key={s} className="contents">
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                i <= stepIndex ? "bg-accent" : "bg-gray-200"
              }`}
            />
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-colors ${
                  i < stepIndex ? "bg-accent" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === "select" && (
        <SelectPlayers
          players={players}
          initialSelected={state.selectedPlayers}
          onNext={handleSelectPlayers}
        />
      )}
      {step === "knockouts" && (
        <RecordKnockouts
          players={state.selectedPlayers}
          initialKnockouts={state.knockouts}
          onNext={handleKnockouts}
          onBack={() => setStep("select")}
        />
      )}
      {step === "positions" && (
        <SetPositions
          players={state.selectedPlayers}
          knockouts={state.knockouts}
          initialPositions={state.positions}
          onNext={handlePositions}
          onBack={() => setStep("knockouts")}
        />
      )}
      {step === "confirm" && (
        <ConfirmGame
          state={state}
          players={state.selectedPlayers}
          isSaving={isSaving}
          onConfirm={handleConfirm}
          onBack={() => setStep("positions")}
        />
      )}
    </div>
  );
}
