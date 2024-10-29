"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type GameState = "landing" | "waiting" | "inGame";

export interface Player {
  id: string;
  bazarId?: string;
  name: string;
  image?: string;
  score?: number;
  isCreator?: boolean;
}

interface GameContextType {
  state: GameState;
  setState: (newState: GameState) => void;
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  joinedUsers: Player[];
  setJoinedUsers: (players: Player[]) => void;
  gameProcess: string;
  activeDrawer: string;
  setActiveDrawer: (drawer: string) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  maxRounds: number;
  // setGameProcess: (process: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>("landing");
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [joinedUsers, setJoinedUsers] = useState<Player[]>([]);
  // const [gameProcess, setGameProcess] = useState<string>("");
  const gameProcess = "DVfmQJsqhoRxPdr5U9fUVCSz4n0qyhyw_Dtlj2_QEuc";
  const [activeDrawer, setActiveDrawer] = useState<string>("");
  const [currentRound, setCurrentRound] = useState<number>(1);
  const maxRounds = 8;

  return (
    <GameContext.Provider
      value={{
        state,
        setState,
        currentPlayer,
        setCurrentPlayer,
        joinedUsers,
        setJoinedUsers,
        gameProcess,
        // setGameProcess,
        activeDrawer,
        setActiveDrawer,
        currentRound,
        setCurrentRound,
        maxRounds,
      }}
    >
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
