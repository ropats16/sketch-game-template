"use client"

import { createContext, useContext, useState, ReactNode } from "react";

type GameState = "landing" | "waiting" | "inGame";

interface Player {
  id: number;
  name: string;
}

interface GameContextType {
  state: GameState;
  setState: (newState: GameState) => void;
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player) => void;
  joinedUsers: Player[];
  setJoinedUsers: (players: Player[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>("landing");
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [joinedUsers, setJoinedUsers] = useState<Player[]>([]);

  return (
    <GameContext.Provider value={{ state, setState, currentPlayer, setCurrentPlayer, joinedUsers, setJoinedUsers }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
