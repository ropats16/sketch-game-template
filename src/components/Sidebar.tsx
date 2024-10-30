import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameContext } from "@/context/GameContext";
import {
  Pencil,
  MessageCircle,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const { gameState, joinedPlayers } = useGameContext();
  return (
    <aside
      // className={`w-80 z-10 bg-muted p-6 transition-all duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
      className={`w-80 z-10 bg-muted p-6`}
    >
      {/* <Button
          variant="ghost"
          size="icon"
          className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-muted"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <ChevronRight /> : <ChevronLeft />}
        </Button> */}
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
            {joinedPlayers
              // .sort((a, b) => b.score! - a.score!)
              .map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span className="flex items-center">
                    {user.name}
                    {user.id === gameState.activeDrawer && (
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
  );
}
