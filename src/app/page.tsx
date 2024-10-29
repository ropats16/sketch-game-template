"use client";

import LandingPage from "@/components/LandingPage";
import WaitingRoom from "@/components/WaitingRoom";
import GameRound from "@/components/GameRound";
import { useGameContext } from "@/context/GameContext";
import { useConnection } from "arweave-wallet-kit";

export default function SketchGuessApp() {
  const { state, setState, setCurrentPlayer } = useGameContext();
  const { connected } = useConnection();

  if (!connected) {
    setState("landing");
    setCurrentPlayer(null);
  }

  return (
    <div className="flex flex-col justify-center h-full my-10">
      {state === "landing" && <LandingPage />}
      {state === "waiting" && <WaitingRoom />}
      {state === "inGame" && <GameRound />}
    </div>
  );
}
