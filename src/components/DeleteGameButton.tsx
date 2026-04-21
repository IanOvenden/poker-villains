"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGameAction } from "@/app/actions/games";

interface DeleteGameButtonProps {
  gameId: string;
  redirectAfter?: boolean;
  className?: string;
}

export function DeleteGameButton({
  gameId,
  redirectAfter = false,
  className = "",
}: DeleteGameButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this game? This cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      await deleteGameAction(gameId);
      if (redirectAfter) {
        router.push("/games");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label="Delete game"
      className={`text-danger cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <span className="text-xs">Deleting…</span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      )}
    </button>
  );
}
