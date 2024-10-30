import { useGameContext } from "@/context/GameContext";
import { dryrunResult, messageResult } from "@/lib/utils";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { toast } from "@/hooks/use-toast";

export default function Drawing() {
  const { gameState, currentPlayer, setChosenWord, chosenWord, setMode, mode } =
    useGameContext();

  const [timeLeft, setTimeLeft] = useState(60);

  const fetchGameState = async () => {
    const GameState = await dryrunResult(gameState.gameProcess, [
      {
        name: "Action",
        value: "Game-State",
      },
    ]);

    console.log("Game state result", GameState.mode);

    if (GameState.mode == "Guessing") {
      toast({
        title: "Game started.",
        description: "You are being redirected to the guessing page.",
      });
      setMode("guessing");
    }
  };

  const fetchChosenWord = async () => {
    console.log("Fetching chosen word");
    // Wait for the player registration message to be sent to the AO process
    const { Messages, Spawns, Output, Error } = await messageResult(
      gameState.gameProcess,
      [
        {
          name: "Action",
          value: "Chosen-Word",
        },
      ]
    );

    setChosenWord(Messages[0].Data);
  };

  useEffect(() => {
    console.log("Time Stamp:", gameState.currentTimestamp);
    if (
      currentPlayer &&
      currentPlayer.id === gameState.activeDrawer &&
      chosenWord === ""
    ) {
      fetchChosenWord();
    }

    const interval = setInterval(() => {
      // userRes();
      // fetchGameState();
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0 && mode === "drawing") {
        fetchGameState();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className="flex-grow items-start p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              Round {gameState.currentRound}/{gameState.maxRounds}
            </span>
            <span className="font-medium">Time: {timeLeft}s</span>
          </div>
        </header>

        {currentPlayer && currentPlayer.id === gameState.activeDrawer ? (
          <div className="h-screen">
            <h2 className="text-xl font-semibold mb-4">Draw: {chosenWord}</h2>
            <Canvas timeLeft={timeLeft} />
          </div>
        ) : (
          <div className="w-full h-screen flex flex-col items-center justify-start">
            <span className="text-xl font-bold text-muted-foreground text-center pt-20">
              Waiting for{" "}
              <span className="text-red-400">{gameState.activeDrawer}</span> to
              finish drawing...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
