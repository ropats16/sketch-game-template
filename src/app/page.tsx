"use client";

import LandingPage from "@/components/LandingPage";
import WaitingRoom from "@/components/WaitingRoom";
import GameRound from "@/components/GameRound";
import { useGameContext } from "@/context/GameContext";

export default function SketchGuessApp() {
  const { state } = useGameContext();

  return (
    <div className="min-h-screen">
      {state === "landing" && <LandingPage />}
      {state === "waiting" && <WaitingRoom />}
      {state === "inGame" && <GameRound />}
    </div>
  );
}
