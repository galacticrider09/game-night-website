import ticTacToe from "@/assets/game-tictactoe.jpg";
import trivia from "@/assets/game-trivia.jpg";
import wyr from "@/assets/game-wyr.jpg";
import draw from "@/assets/game-draw.jpg";

export type Game = {
  id: string;
  title: string;
  description: string;
  image: string;
  minutes: string;
  tag: string;
};

export const games: Game[] = [
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    description: "Hearts vs. kisses. Best of three, loser makes the tea.",
    image: ticTacToe,
    minutes: "2 min",
    tag: "Classic",
  },
  {
    id: "trivia",
    title: "Couple's Trivia",
    description: "How well do you actually know each other? Prove it.",
    image: trivia,
    minutes: "10 min",
    tag: "Quiz",
  },
  {
    id: "would-you-rather",
    title: "Would You Rather",
    description: "Impossible choices, revealing answers, zero mercy.",
    image: wyr,
    minutes: "5 min",
    tag: "Talky",
  },
  {
    id: "draw-together",
    title: "Draw Together",
    description: "One canvas, two cursors. Guess what they're scribbling.",
    image: draw,
    minutes: "8 min",
    tag: "Creative",
  },
];

export const getGame = (id: string) => games.find((g) => g.id === id);
