"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Users, Clock, Trophy } from "lucide-react";
import { useGameContext } from "@/context/GameContext";

export default function LandingPage() {
  const [nickname, setNickname] = useState("");
  const { setState, setCurrentPlayer, setJoinedUsers, joinedUsers } = useGameContext();

  const handlePlayNow = () => {
    if (nickname.trim()) {
      const player = { id: Date.now(), name: nickname.trim() };
      setCurrentPlayer(player);
      setJoinedUsers([...joinedUsers, player]);
      setState("waiting");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background text-foreground p-6 md:p-12">
      <header className="w-full max-w-4xl">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">SketchGuess</h1>
          <Button variant="ghost">Log In</Button>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center max-w-4xl w-full">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Draw, Guess, Laugh</h2>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
          The ultimate online drawing and guessing game for friends and family.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Input
            placeholder="Enter your nickname"
            className="flex-grow"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handlePlayNow();
              }
            }}
          />
          <Button size="lg" className="w-full sm:w-auto" onClick={handlePlayNow}>
            Play Now
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { icon: Pencil, text: "Draw" },
            { icon: Users, text: "Multiplayer" },
            { icon: Clock, text: "Quick Rounds" },
            { icon: Trophy, text: "Leaderboards" },
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <feature.icon className="h-8 w-8 mb-2" />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center text-sm text-muted-foreground">
        <p>&copy; 2024 SketchGuess. All rights reserved.</p>
      </footer>
    </div>
  );
}
