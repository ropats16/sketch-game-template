import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";

export default function JoinWaiting() {
  const { setState, setJoinedUsers, currentPlayer, gameProcess } =
    useGameContext();

  const handlePlayNow = async () => {
    console.log("Button clicked");

    if (currentPlayer) {
      console.log("Current player:", currentPlayer);

      try {
        // Wait for the player registration message to be sent to the AO process
        const sendRes = await message({
          process: gameProcess,
          signer: createDataItemSigner(window.arweaveWallet),
          tags: [
            {
              name: "Action",
              value: "Register-Player",
            },
            {
              name: "DisplayName",
              value: currentPlayer.name,
            },
          ],
        });

        console.log("Register player result", sendRes);

        let { Messages, Spawns, Output, Error } = await result({
          // the arweave TXID of the message
          message: sendRes,
          // the arweave TXID of the process
          process: gameProcess,
        });

        console.dir(
          { Messages, Spawns, Output, Error },
          { depth: Infinity, colors: true }
        );

        if (Messages[0].Data === "Successfully registered to game.") {
          toast({
            title: "Successfully registered.",
            description: "Waiting for other players to join.",
          });

          //   setJoinedUsers([...joinedUsers, currentPlayer]);
          setState("waiting");
        } else if (Messages[0].Data === "You are already registered.") {
          toast({
            title: "Player already registered.",
            description: "Please wait for other players to join.",
          });

          //   setJoinedUsers([...joinedUsers, currentPlayer]);
        } else return;

        const userRes = await dryrun({
          process: gameProcess,
          tags: [
            {
              name: "Action",
              value: "Joined-Users",
            },
          ],
        }).then((res) => JSON.parse(res.Messages[0].Data));

        console.log("Joined users result", userRes);
        if (
          userRes.some(
            (user: { id: string; isCreator: number }) =>
              user.id === currentPlayer.id && user.isCreator === 1
          )
        ) {
          currentPlayer.isCreator = true;
        }
        setJoinedUsers(userRes);
        setTimeout(() => {
          setState("waiting");
        }, 1000);
      } catch (error) {
        toast({
          title: "An error occurred while registering.",
          description: "Please try again.",
        });
      }
    } else {
      toast({
        title: "Please login to play.",
        description: "Click on the connect button at the top.",
      });
    }
  };

  return (
    <Button size="lg" className="w-full sm:w-auto" onClick={handlePlayNow}>
      Play Now
    </Button>
  );
}
