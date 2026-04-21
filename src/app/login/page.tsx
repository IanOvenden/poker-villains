"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { signIn, registerPlayer } from "@/lib/auth";
import { getPlayers } from "@/lib/firestore";
import type { Player } from "@/types";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"select" | "pin">("select");

  useEffect(() => {
    if (!loading && user) router.replace("/standings");
  }, [user, loading, router]);

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  function handlePlayerSelect(player: Player) {
    setSelectedPlayer(player);
    setPin("");
    setError("");
    setStep("pin");
  }

  async function handlePinSubmit() {
    if (!selectedPlayer || pin.length < 4) return;
    setIsSubmitting(true);
    setError("");

    try {
      await signIn(selectedPlayer.name, selectedPlayer.id, pin);
      router.replace("/standings");
    } catch {
      try {
        await registerPlayer(selectedPlayer.name, selectedPlayer.id, pin);
        router.replace("/standings");
      } catch {
        setError("Incorrect PIN. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePinChange(value: string) {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
      setError("");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Poker Villains"
            width={120}
            height={120}
            priority
          />
        </div>

        {step === "select" && (
          <>
            <h1 className="text-2xl font-medium text-center text-text-primary mb-2">
              Who are you?
            </h1>
            <p className="text-text-secondary text-center text-sm mb-8">
              Select your name to continue
            </p>
            <div className="flex flex-col gap-3">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerSelect(player)}
                  className="w-full py-4 px-6 bg-surface rounded-2xl text-left text-text-primary font-medium border border-gray-100 active:bg-gray-50 transition-colors"
                >
                  {player.name}
                </button>
              ))}
            </div>
          </>
        )}

        {step === "pin" && selectedPlayer && (
          <>
            <button
              onClick={() => setStep("select")}
              className="text-text-secondary text-sm mb-6 flex items-center gap-1"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-medium text-center text-text-primary mb-2">
              Hey {selectedPlayer.name}
            </h1>
            <p className="text-text-secondary text-center text-sm mb-8">
              Enter your PIN to continue
            </p>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              placeholder="Enter PIN"
              className="w-full py-4 px-6 bg-surface rounded-2xl text-center text-text-primary text-xl tracking-widest border border-gray-100 outline-none focus:border-accent transition-colors mb-4"
              autoFocus
            />
            {error && (
              <p className="text-danger text-sm text-center mb-4">{error}</p>
            )}
            <button
              onClick={handlePinSubmit}
              disabled={pin.length < 4 || isSubmitting}
              className="w-full py-4 bg-accent text-white rounded-2xl font-medium disabled:opacity-40 transition-opacity"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
            <p className="text-text-secondary text-xs text-center mt-4">
              First time? Set any 4–6 digit PIN and it will be saved for next
              time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
