"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface Props {
  prevId: string;
  nextId: string;
  gameNumber: number;
  totalGames: number;
}

export function GameNav({ prevId, nextId, gameNumber, totalGames }: Props) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") router.push(`/games/${prevId}`);
      if (e.key === "ArrowRight") router.push(`/games/${nextId}`);
    }

    function onTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
    }

    function onTouchEnd(e: TouchEvent) {
      if (touchStartX.current === null) return;
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      touchStartX.current = null;
      if (Math.abs(delta) < 60) return;
      router.push(delta > 0 ? `/games/${nextId}` : `/games/${prevId}`);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [prevId, nextId, router]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-surface/90 backdrop-blur-sm border-t border-gray-100">
          <button
            onClick={() => router.push(`/games/${prevId}`)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary active:text-text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <span className="text-xs text-text-secondary tabular-nums">
            Game {gameNumber} of {totalGames}
          </span>

          <button
            onClick={() => router.push(`/games/${nextId}`)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary active:text-text-primary transition-colors"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
