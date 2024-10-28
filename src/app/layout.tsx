import "./globals.css";
import { Inter } from "next/font/google";
import { GameProvider } from "@/context/GameContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SketchGuess",
  description: "A multiplayer drawing and guessing game.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
