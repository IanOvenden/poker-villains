"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { KeyboardSensor } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { setAllPositions } from "@/lib/draftGame";
import type { Player } from "@/types";

interface SortablePlayerProps {
  player: Player;
  index: number;
  knockouts: Record<string, string[]>;
}

function SortablePlayer({ player, index, knockouts }: SortablePlayerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const positionLabels: Record<number, string> = {
    1: "1st",
    2: "2nd",
    3: "3rd",
  };
  const label = positionLabels[index + 1] || `${index + 1}th`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface rounded-2xl px-4 py-4 flex items-center gap-4 border border-gray-100 touch-none"
    >
      <span
        className={`text-sm font-medium w-8 ${
          index === 0 ? "text-accent" : "text-text-secondary"
        }`}
      >
        {label}
      </span>
      <span className="flex-1 font-medium text-text-primary">
        {player.name}
      </span>
      {(knockouts[player.id]?.length ?? 0) > 0 && (
        <span className="text-xs text-text-secondary">
          {knockouts[player.id].length} KO
        </span>
      )}
      <button
        {...attributes}
        {...listeners}
        className="w-8 h-8 flex flex-col justify-center items-center gap-1 text-text-secondary cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <span className="w-4 h-0.5 bg-text-secondary rounded-full" />
        <span className="w-4 h-0.5 bg-text-secondary rounded-full" />
        <span className="w-4 h-0.5 bg-text-secondary rounded-full" />
      </button>
    </div>
  );
}

interface Props {
  players: Player[];
  knockouts: Record<string, string[]>;
  positions: Record<string, number>;
  draftId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function SetPositions({
  players,
  knockouts,
  positions,
  draftId,
  onNext,
  onBack,
}: Props) {
  // Derive the sorted order from Firestore positions; local state for drag responsiveness
  const [ordered, setOrdered] = useState<Player[]>(() =>
    [...players].sort(
      (a, b) => (positions[a.id] ?? 99) - (positions[b.id] ?? 99),
    ),
  );

  // Sync when Firestore positions change (remote user reordered)
  useEffect(() => {
    setOrdered(
      [...players].sort(
        (a, b) => (positions[a.id] ?? 99) - (positions[b.id] ?? 99),
      ),
    );
  }, [positions, players]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = ordered.findIndex((p) => p.id === active.id);
      const newIndex = ordered.findIndex((p) => p.id === over.id);
      const newOrdered = arrayMove(ordered, oldIndex, newIndex);
      setOrdered(newOrdered);
      // Persist new order to Firestore for real-time sync
      const newPositions: Record<string, number> = {};
      newOrdered.forEach((player, index) => {
        newPositions[player.id] = index + 1;
      });
      setAllPositions(draftId, newPositions);
    }
  }

  async function handleNext() {
    // Ensure positions are written before advancing step
    const newPositions: Record<string, number> = {};
    ordered.forEach((player, index) => {
      newPositions[player.id] = index + 1;
    });
    await setAllPositions(draftId, newPositions);
    onNext();
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-text-secondary text-sm mb-6 flex items-center gap-1"
      >
        ← Back
      </button>
      <h2 className="text-xl font-medium text-text-primary mb-1">
        Finishing positions
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        Drag players into finishing order, winner at the top
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ordered.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3 mb-8">
            {ordered.map((player, index) => (
              <SortablePlayer
                key={player.id}
                player={player}
                index={index}
                knockouts={knockouts}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={handleNext}
        className="w-full py-4 bg-accent text-white rounded-2xl font-medium"
      >
        Continue
      </button>
    </div>
  );
}
