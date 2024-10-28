"use client";

import { Button } from "@/components/ui/button";
import { UserCircle2, Copy, Users } from "lucide-react";
import { useGameContext } from "@/context/GameContext";

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
  const { currentPlayer, joinedUsers, setJoinedUsers, setState } = useGameContext();
  const roomCode = "SKETCH123";
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

  const handleLeaveRoom = () => {
    setJoinedUsers(joinedUsers.filter((user) => user.id !== currentPlayer.id));
    setState("landing");
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background text-foreground p-6 md:p-12">
      <header className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">SketchGuess</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Room Code:</span>
          <code className="bg-muted px-2 py-1 rounded">{roomCode}</code>
          <Button
            variant="ghost"
            size="icon"
            title="Copy room code"
            onClick={() => navigator.clipboard.writeText(roomCode)}
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
                i < joinedUsers.length ? pastelColors[i % pastelColors.length] : "bg-muted"
              }`}
            >
              {i < joinedUsers.length ? (
                <>
                  <UserCircle2 className="h-12 w-12 mb-2 text-primary" />
                  <span className="text-sm font-medium">{joinedUsers[i].name}</span>
                </>
              ) : (
                <Users className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="px-8" onClick={handleStartGame} disabled={joinedUsers.length < 2}>
            Start Game
          </Button>
          <Button variant="outline" size="lg" onClick={handleLeaveRoom}>
            Leave Room
          </Button>
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center text-sm text-muted-foreground">
        <p>
          {joinedUsers.length} / {maxPlayers} players joined
        </p>
      </footer>
    </div>
  );
}