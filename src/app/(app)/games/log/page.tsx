import { getPlayers } from "@/lib/firestore";
import LogGameStepper from "@/components/LogGame/LogGameStepper";

export default async function LogGamePage() {
  const players = await getPlayers();

  return <LogGameStepper players={players} />;
}
