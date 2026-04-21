"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getActiveSeason, getPlayerStats, updatePlayerVillain } from "@/lib/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import type { PlayerStats, Season } from "@/types";
import { VILLAINS } from "@/lib/villains";
import VillainAvatar from "@/components/VillainAvatar";

const PIN_SUFFIX = "_PV_2024";

export default function ProfilePage() {
  const { user, player, loading: authLoading } = useAuth();
  const [data, setData] = useState<{
    season: Season | null;
    stats: PlayerStats | null;
    loaded: boolean;
  }>({ season: null, stats: null, loaded: false });

  const [selectedVillainId, setSelectedVillainId] = useState<string | null>(
    player?.villainId ?? null,
  );
  const [villainSaving, setVillainSaving] = useState(false);

  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (authLoading) return;

      if (!player) {
        if (!cancelled) setData({ season: null, stats: null, loaded: true });
        return;
      }

      try {
        const activeSeason = await getActiveSeason();
        const playerStats = activeSeason
          ? await getPlayerStats(player.id, activeSeason.id)
          : null;
        if (!cancelled)
          setData({ season: activeSeason, stats: playerStats, loaded: true });
      } catch (err) {
        console.error("Error loading profile data:", err);
        if (!cancelled) setData({ season: null, stats: null, loaded: true });
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [player, authLoading]);

  async function handleVillainSelect(villainId: string) {
    if (!player || villainSaving) return;
    setSelectedVillainId(villainId);
    setVillainSaving(true);
    try {
      await updatePlayerVillain(player.id, villainId);
    } finally {
      setVillainSaving(false);
    }
  }

  async function handlePinChange() {
    if (!user) return;
    if (newPin !== confirmPin) {
      setPinError("New PINs don't match.");
      return;
    }
    if (newPin.length < 4) {
      setPinError("PIN must be at least 4 digits.");
      return;
    }

    setIsSaving(true);
    setPinError("");

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        `${currentPin}${PIN_SUFFIX}`,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, `${newPin}${PIN_SUFFIX}`);
      setPinSuccess(true);
      setShowPinChange(false);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch {
      setPinError("Current PIN is incorrect.");
    } finally {
      setIsSaving(false);
    }
  }

  if (authLoading || !data.loaded) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center pt-20">
        <p className="text-text-secondary">Player not found.</p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {selectedVillainId ? (
          <VillainAvatar villainId={selectedVillainId} size={64} />
        ) : (
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-accent font-medium text-2xl">
              {player.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-medium text-text-primary">
            {player.name}
          </h1>
          <h2 className="text-lg font-medium text-accent mt-0.5">
            Season {data.season?.number}
          </h2>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Total points</p>
          <p className="text-2xl font-medium text-text-primary">
            {data.stats?.totalPoints ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Net earnings</p>
          <p
            className={`text-2xl font-medium ${(data.stats?.netEarnings ?? 0) >= 0 ? "text-accent" : "text-danger"}`}
          >
            {(data.stats?.netEarnings ?? 0) >= 0 ? "+" : ""}£
            {data.stats?.netEarnings ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Games played</p>
          <p className="text-2xl font-medium text-text-primary">
            {data.stats?.gamesPlayed ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Win rate</p>
          <p className="text-2xl font-medium text-text-primary">
            {data.stats?.winRate ?? 0}%
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Wins</p>
          <p className="text-2xl font-medium text-text-primary">
            {data.stats?.wins ?? 0}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-text-secondary mb-1">Knockouts</p>
          <p className="text-2xl font-medium text-text-primary">
            {data.stats?.totalKnockouts ?? 0}
          </p>
        </div>
      </div>

      {/* Villain picker */}
      <div className="bg-surface rounded-2xl border border-gray-100 p-4 mb-4">
        <div className="mb-3">
          <p className="font-medium text-text-primary">Your villain</p>
          {selectedVillainId ? (
            <div className="flex items-center gap-3 mt-1">
              <VillainAvatar villainId={selectedVillainId} size={36} />
              <span className="text-text-secondary text-sm">
                {VILLAINS.find((v) => v.id === selectedVillainId)?.name}
                {" — "}
                {VILLAINS.find((v) => v.id === selectedVillainId)?.tagline}
              </span>
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-0.5">None chosen yet</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {VILLAINS.map((villain) => {
            const isSelected = selectedVillainId === villain.id;
            return (
              <button
                key={villain.id}
                onClick={() => handleVillainSelect(villain.id)}
                disabled={villainSaving}
                className={[
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-60",
                  isSelected
                    ? "border-accent bg-accent/10 text-text-primary"
                    : "border-gray-100 bg-background text-text-secondary hover:border-accent/40 hover:text-text-primary",
                ].join(" ")}
              >
                <VillainAvatar villainId={villain.id} size={32} />
                <span className="text-sm font-medium leading-tight">{villain.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PIN change */}
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden mb-4">
        <button
          onClick={() => {
            setShowPinChange(!showPinChange);
            setPinError("");
            setPinSuccess(false);
          }}
          className="w-full px-4 py-4 flex items-center justify-between"
        >
          <span className="font-medium text-text-primary">Change PIN</span>
          <span className="text-text-secondary text-sm">
            {showPinChange ? "▲" : "▼"}
          </span>
        </button>

        {showPinChange && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Current PIN"
              value={currentPin}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) &&
                setCurrentPin(e.target.value.slice(0, 6))
              }
              className="w-full py-3 px-4 bg-background rounded-xl text-text-primary border border-gray-100 outline-none focus:border-accent transition-colors text-center tracking-widest"
            />
            <input
              type="password"
              inputMode="numeric"
              placeholder="New PIN"
              value={newPin}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) &&
                setNewPin(e.target.value.slice(0, 6))
              }
              className="w-full py-3 px-4 bg-background rounded-xl text-text-primary border border-gray-100 outline-none focus:border-accent transition-colors text-center tracking-widest"
            />
            <input
              type="password"
              inputMode="numeric"
              placeholder="Confirm new PIN"
              value={confirmPin}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) &&
                setConfirmPin(e.target.value.slice(0, 6))
              }
              className="w-full py-3 px-4 bg-background rounded-xl text-text-primary border border-gray-100 outline-none focus:border-accent transition-colors text-center tracking-widest"
            />
            {pinError && (
              <p className="text-danger text-sm text-center">{pinError}</p>
            )}
            <button
              onClick={handlePinChange}
              disabled={
                isSaving ||
                currentPin.length < 4 ||
                newPin.length < 4 ||
                confirmPin.length < 4
              }
              className="w-full py-3 bg-accent text-white rounded-xl font-medium disabled:opacity-40"
            >
              {isSaving ? "Saving..." : "Update PIN"}
            </button>
          </div>
        )}
      </div>

      {pinSuccess && (
        <p className="text-accent text-sm text-center mb-4">
          PIN updated successfully.
        </p>
      )}
    </div>
  );
}
