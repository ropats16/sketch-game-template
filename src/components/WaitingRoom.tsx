"use client";

import { Button } from "@/components/ui/button";
import { UserCircle2, Copy, Users } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import LeaveGame from "./LeaveGame";
import { use, useEffect } from "react";
import { dryrun } from "@permaweb/aoconnect";
import { toast } from "@/hooks/use-toast";

const pastelColors = [
  "bg-red-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-orange-200",
];

export default function WaitingRoom() {
  const {
    currentPlayer,
    joinedUsers,
    setJoinedUsers,
    setState,
    gameProcess,
    setActiveDrawer,
    setCurrentRound,
  } = useGameContext();
  const maxPlayers = 8;

  if (!currentPlayer) {
    setState("landing");
    return null;
  }

  const handleStartGame = () => {
    if (joinedUsers.length >= 2) {
      setState("inGame");
    }
  };

  const userRes = async () => {
    try {
      const userRes = await dryrun({
        process: gameProcess,
        tags: [
          {
            name: "Action",
            value: "Joined-Users",
          },
        ],
      }).then((res) => JSON.parse(res.Messages[0].Data));

      // console.log("Joined users result", userRes);
      if (userRes !== joinedUsers) {
        setJoinedUsers(userRes);
      } else return;
    } catch (error) {
      toast({
        title: "An error occurred while fetching joined users.",
        description: "We'll try again shortly.",
      });
    }
  };

  const fetchGameState = async () => {
    try {
      console.log("Fetching game state");
      const GameState = await dryrun({
        process: gameProcess,
        tags: [
          {
            name: "Action",
            value: "Game-State",
          },
        ],
      }).then((res) => JSON.parse(res.Messages[0].Data));

      console.log("Game state result", GameState.mode);

      if (GameState.mode == "Playing") {
        toast({
          title: "Game started.",
          description: "You are being redirected to the game.",
        });
        setActiveDrawer(GameState.activeDrawer);
        setCurrentRound(GameState.currentRound);
        setState("inGame");
      }
    } catch (error) {
      toast({
        title: "An error occurred while fetching game state.",
        description: "We'll try again shortly.",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      userRes();
      fetchGameState();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between bg-background min-h-screen text-foreground p-6 md:p-12">
      <header className="w-full max-w-4xl flex justify-between items-center">
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-sm font-medium">Room Code:</span>
          <code className="bg-muted px-2 py-1 rounded">{gameProcess}</code>
          <Button
            variant="ghost"
            size="icon"
            title="Copy room code"
            onClick={() => navigator.clipboard.writeText(gameProcess)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8">Waiting Room</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 w-full max-w-2xl">
          {Array.from({ length: maxPlayers }, (_, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center p-4 rounded-lg aspect-square ${
                i < joinedUsers.length
                  ? pastelColors[i % pastelColors.length]
                  : "bg-muted"
              }`}
            >
              {i < joinedUsers.length ? (
                <>
                  <UserCircle2 className="h-12 w-12 mb-2 text-primary" />
                  <span className="text-sm font-medium">
                    {joinedUsers[i].name}
                  </span>
                </>
              ) : (
                <Users className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {currentPlayer.isCreator && (
            <Button
              size="lg"
              className="px-8"
              onClick={handleStartGame}
              disabled={joinedUsers.length < 2}
            >
              Start Game
            </Button>
          )}
          <LeaveGame />
        </div>

        <div className="w-full mt-10 max-w-4xl text-center text-sm text-muted-foreground">
          <p>
            {joinedUsers.length} / {maxPlayers} players joined
          </p>
        </div>
      </main>
    </div>
  );
}
