import { useState } from "react";
import { Heart, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cell = "P1" | "P2" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winnerOf(board: Cell[]) {
  for (const [a, b, c] of LINES) {
    if (board[a!] && board[a!] === board[b!] && board[a!] === board[c!]) {
      return { player: board[a!]!, line: [a!, b!, c!] };
    }
  }
  return null;
}

export function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"P1" | "P2">("P1");

  const result = winnerOf(board);
  const full = board.every(Boolean);

  const play = (i: number) => {
    if (board[i] || result) return;
    const nextBoard = [...board];
    nextBoard[i] = turn;
    setBoard(nextBoard);
    setTurn(turn === "P1" ? "P2" : "P1");
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn("P1");
  };

  const status = result
    ? `${result.player === "P1" ? "Mira" : "Dev"} wins this round`
    : full
      ? "A perfect tie — how romantic"
      : `${turn === "P1" ? "Mira's" : "Dev's"} turn`;

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold">Tic-Tac-Toe</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{status}</p>
        </div>
        <Button variant="soft" size="sm" onClick={reset}>
          <RotateCcw className="size-4" />
          Rematch
        </Button>
      </div>

      <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            aria-label={`Cell ${i + 1}`}
            className={cn(
              "grid aspect-square place-items-center rounded-2xl bg-white/6 transition-all duration-200 hover:bg-white/12",
              result?.line.includes(i) && "bg-gradient-warm",
            )}
          >
            {cell === "P1" && (
              <Heart
                className={cn(
                  "size-9 fill-blush text-blush",
                  result?.line.includes(i) && "fill-navy text-navy",
                )}
              />
            )}
            {cell === "P2" && (
              <X
                className={cn("size-10 text-lavender", result?.line.includes(i) && "text-navy")}
                strokeWidth={3}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
