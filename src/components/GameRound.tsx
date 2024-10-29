"use client";

import { useState, useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  MessageCircle,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGameContext } from "@/context/GameContext";

export default function GameRound() {
  const [selectedWord, setSelectedWord] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [guesses, setGuesses] = useState<{ playerId: number; guess: string }[]>(
    []
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chatMessages, setChatMessages] = useState<
    { playerId: number; message: string }[]
  >([]);

  const { joinedUsers, activeDrawer, currentRound, maxRounds } =
    useGameContext();

  // useEffect(() => {
  //   if (isDrawing && timeLeft > 0) {
  //     const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
  //     return () => clearTimeout(timer);
  //   } else if (timeLeft === 0) {
  //     endTurn();
  //   }
  // }, [isDrawing, timeLeft]);

  // const startNewTurn = () => {
  //   setWordOptions(words.sort(() => 0.5 - Math.random()).slice(0, 3));
  //   setSelectedWord("");
  //   setIsDrawing(false);
  //   setTimeLeft(60);
  //   setGuesses([]);
  // };

  const selectWord = (word: string) => {
    setSelectedWord(word);
    setIsDrawing(true);
  };

  // const endTurn = () => {
  //   // Calculate scores based on guesses
  //   const correctGuesses = guesses.filter(
  //     (g) => g.guess.toLowerCase() === selectedWord.toLowerCase()
  //   );
  //   correctGuesses.forEach((guess, index) => {
  //     const player = players.find((p) => p.id === guess.playerId);
  //     if (player) {
  //       player.score += Math.max(10 - index, 1); // First correct guess gets 10 points, second 9, and so on
  //     }
  //   });

  //   // Move to next player
  //   const currentIndex = players.findIndex((p) => p.id === currentDrawer.id);
  //   setCurrentDrawer(players[(currentIndex + 1) % players.length]);

  //   // Start new round if all players have drawn
  //   if ((currentIndex + 1) % players.length === 0) {
  //     setCurrentRound(currentRound + 1);
  //     if (currentRound >= 8) {
  //       // End game logic here
  //       alert("Game Over!");
  //       return;
  //     }
  //   }

  //   startNewTurn();
  // };

  const submitGuess = (playerId: number, guess: string) => {
    setGuesses([...guesses, { playerId, guess }]);
  };

  const sendChatMessage = (playerId: number, message: string) => {
    setChatMessages([...chatMessages, { playerId, message }]);
  };

  return (
    <div className="flex bg-background min-h-screen text-foreground">
      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <span className="font-medium">
                Round {currentRound}/{maxRounds}
              </span>
              <span className="font-medium">Time: {timeLeft}s</span>
            </div>
          </header>

          {/* {!isDrawing && currentDrawer.id === players[0].id && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Choose a word to draw:
              </h2>
              <div className="flex space-x-4">
                {wordOptions.map((word) => (
                  <Button key={word} onClick={() => selectWord(word)}>
                    {word}
                  </Button>
                ))}
              </div>
            </div>
          )} */}

          {/* {isDrawing && currentDrawer.id === players[0].id && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Draw: {selectedWord}
              </h2>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-300 rounded-lg"
              />
              <Button className="mt-4" onClick={endTurn}>
                Submit Drawing
              </Button>
            </div>
          )} */}
          {/* 
          {currentDrawer.id !== players[0].id && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {currentDrawer.name} is drawing...
              </h2>
              {isDrawing ? (
                <canvas
                  width={800}
                  height={600}
                  className="border border-gray-300 rounded-lg"
                />
              ) : (
                <div className="w-full h-[600px] bg-muted flex items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground">
                    Waiting for {currentDrawer.name} to choose a word...
                  </span>
                </div>
              )}
              {isDrawing && (
                <div className="mt-4 flex space-x-4">
                  <Input
                    placeholder="Enter your guess"
                    className="flex-grow"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        submitGuess(players[0].id, e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <Button onClick={() => submitGuess(players[0].id, "")}>
                    Submit Guess
                  </Button>
                </div>
              )} */}
          {/* </div> */}
        </div>
      </main>

      <aside
        className={`w-80 bg-muted p-6 transition-all duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-muted"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <Tabs defaultValue="leaderboard">
          <TabsList className="w-full">
            {/* <TabsTrigger value="chat" className="w-1/2">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger> */}
            <TabsTrigger value="leaderboard" className="w-1/2">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>
          {/* <TabsContent value="chat" className="mt-4">
            <div className="h-[calc(100vh-12rem)] overflow-y-auto mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">
                    {players.find((p) => p.id === msg.playerId)?.name}:{" "}
                  </span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                placeholder="Type a message"
                className="flex-grow"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendChatMessage(players[0].id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button onClick={() => sendChatMessage(players[0].id, "")}>
                Send
              </Button>
            </div>
          </TabsContent> */}
          <TabsContent value="leaderboard" className="mt-4">
            <ul>
              {joinedUsers
                // .sort((a, b) => b.score! - a.score!)
                .map((user) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="flex items-center">
                      {user.name}
                      {user.id === activeDrawer && (
                        <Pencil className="w-4 h-4 ml-2 text-primary" />
                      )}
                    </span>
                    <span>{user.score}</span>
                  </li>
                ))}
            </ul>
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
}
