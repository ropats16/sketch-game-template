"use client";

import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Drawing from "./Drawing";
import { useGameContext } from "@/context/GameContext";
import { dryrunResult } from "@/lib/utils";
import Guessing from "./Guessing";

export default function GameRound() {
  const { mode, gameState, joinedPlayers, setJoinedPlayers } = useGameContext();
  const [chatMessages, setChatMessages] = useState<
    { playerId: number; message: string }[]
  >([]);

  const userRes = async () => {
    const updatedPlayers = await dryrunResult(gameState.gameProcess, [
      {
        name: "Action",
        value: "Joined-Players",
      },
    ]);

    console.log("Joined users result in waiting room", updatedPlayers);
    if (updatedPlayers !== joinedPlayers) {
      setJoinedPlayers(updatedPlayers);
    } else console.log("No active player updates");
  };

  useEffect(() => {
    userRes();
  }, [mode]);

  return (
    <main className="flex bg-background min-h-screen text-foreground">
      {mode === "drawing" && <Drawing />}
      {mode === "guessing" && <Guessing />}
      <Sidebar />
    </main>
  );
}
