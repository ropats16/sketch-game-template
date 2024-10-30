import { useGameContext } from "@/context/GameContext";
import { dryrunResult, messageResult } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Guessing() {
  const { gameState, currentPlayer, setMode, mode } = useGameContext();
  const [drawing, setDrawing] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [guess, setGuess] = useState("");
  const [correctGuess, setCorrectGuess] = useState(false);

  const imageLoader = ({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number;
  }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const fetchDrawing = async () => {
    const drawingRes = await dryrunResult(gameState.gameProcess, [
      {
        name: "Action",
        value: "Get-Drawing",
      },
    ]);
    console.log("Drawing result", drawingRes);
    setDrawing(drawingRes[0]);
  };

  const fetchGameState = async () => {
    console.log("Fetching game state");
    const GameState = await dryrunResult(gameState.gameProcess, [
      {
        name: "Action",
        value: "Game-State",
      },
    ]);

    console.log("Game state result", GameState.mode);

    if (GameState.mode == "Drawing") {
      toast({
        title: "Next round started.",
        description: "You are being redirected to the drawing page.",
      });
      setMode("drawing");
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting guess", guess);
    const { Messages, Spawns, Output, Error } = await messageResult(
      gameState.gameProcess,
      [
        {
          name: "Action",
          value: "Submit-Answer",
        },
      ],
      guess
    );

    if (Messages[0].Data === "Correct answer!") {
      console.log("Correct answer!");
      toast({
        title: "Correct answer!",
        description: "You guessed it right!",
      });
      setCorrectGuess(true);
    } else {
      toast({
        title: "Incorrect answer!",
        description: "Please try again.",
      });
    }
  };

  const updateRound = async () => {
    console.log("Updating round");
    const { Messages, Spawns, Output, Error } = await messageResult(
      gameState.gameProcess,
      [
        {
          name: "Action",
          value: "Update-Round",
        },
      ]
    );

    console.log("Round updated result", Messages);

    // if (Messages[0].Data === "Round updated successfully.") {
    //   console.log("Round updated successfully.");
    //   setMode("drawing");
    // }
  };

  useEffect(() => {
    if (drawing === null) {
      fetchDrawing();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // userRes();
      // fetchGameState();
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0 && mode === "guessing") {
        fetchGameState();
        updateRound();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // add fetch state via polling to get drawing to guess
  return (
    <div className="flex-grow items-center p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              Round {gameState.currentRound}/{gameState.maxRounds}
            </span>
            <span className="font-medium">Time: {timeLeft}s</span>
          </div>
        </header>
        <div className="flex flex-col gap-8">
          {drawing && (
            <div className="w-[500px] h-[500px]">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={drawing}
                  alt="Image"
                  layout="fill"
                  className="rounded-md object-cover"
                  loader={imageLoader}
                />
              </AspectRatio>
            </div>
          )}
          {currentPlayer && currentPlayer.id === gameState.activeDrawer ? (
            <h2 className="text-xl font-semibold mb-4">
              Wait while others guess!
            </h2>
          ) : (
            <>
              <div className=" flex gap-6">
                <Input
                  placeholder="Type a message"
                  className="flex-grow"
                  onChange={(e) => setGuess(e.target.value)}
                  disabled={correctGuess}
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={correctGuess}
                >
                  Submit
                </Button>
              </div>
              <h2 className="text-xl font-semibold mb-4">
                It is your time to guess!
              </h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
