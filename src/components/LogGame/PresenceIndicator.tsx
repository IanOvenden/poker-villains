"use client";

import type { DraftGamePresence } from "@/types";

interface Props {
  presence: Record<string, DraftGamePresence>;
  currentPlayerId: string;
}

const STALE_THRESHOLD_MS = 90_000; // 90 seconds

export default function PresenceIndicator({
  presence,
  currentPlayerId,
}: Props) {
  const now = Date.now();
  const activeUsers = Object.entries(presence).filter(([id, p]) => {
    if (id === currentPlayerId) return false;
    const age = now - new Date(p.lastSeen).getTime();
    return age < STALE_THRESHOLD_MS;
  });

  if (activeUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="text-xs text-text-secondary">Also here:</span>
      <div className="flex gap-1.5 flex-wrap">
        {activeUsers.map(([id, p]) => (
          <span
            key={id}
            className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            {p.displayName}
          </span>
        ))}
      </div>
    </div>
  );
}
