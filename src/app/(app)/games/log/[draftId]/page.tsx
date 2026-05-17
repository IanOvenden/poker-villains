import { redirect } from "next/navigation";
import { getDraftGame, getPlayers } from "@/lib/firestore";
import LogGameStepper from "@/components/LogGame/LogGameStepper";

interface Props {
  params: Promise<{ draftId: string }>;
}

export default async function DraftGamePage({ params }: Props) {
  const { draftId } = await params;

  const [draft, allPlayers] = await Promise.all([
    getDraftGame(draftId),
    getPlayers(),
  ]);

  if (!draft) redirect("/games");

  return (
    <LogGameStepper
      draftId={draft.id}
      initialDraft={draft}
      allPlayers={allPlayers}
    />
  );
}
