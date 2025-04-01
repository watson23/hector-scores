import { useEffect, useState } from "react";
import "./index.css";

export default function GolfScoreApp() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState("");
  const [scores, setScores] = useState<{ [player: string]: string[] }>({});
  const [hole, setHole] = useState(1);
  const [holeCount, setHoleCount] = useState(18);
  const [started, setStarted] = useState(false);
  const [roundName, setRoundName] = useState("");
  const [course, setCourse] = useState("hirsala");

  const courses: Record<string, number[]> = {
    hirsala: [4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 4, 5, 4, 3, 5, 3, 4, 5],
    tapiola: [5, 3, 4, 3, 5, 4, 4, 4, 4, 4, 5, 4, 3, 4, 4, 4, 4, 4],
  };

  useEffect(() => {
    const savedRoundName = localStorage.getItem("hector-round-name");
    if (savedRoundName) setRoundName(savedRoundName);

    const savedPlayers = localStorage.getItem("hector-players");
    const savedScores = localStorage.getItem("hector-scores");
    if (savedPlayers && savedScores) {
      setPlayers(JSON.parse(savedPlayers));
      setScores(JSON.parse(savedScores));
      setStarted(true);
    }
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem("hector-players", JSON.stringify(players));
      localStorage.setItem("hector-scores", JSON.stringify(scores));
    }
  }, [players, scores]);

  const addPlayer = () => {
    if (playerInput.trim() === "") return;
    const newPlayers = [...players, playerInput.trim()];
    setPlayers(newPlayers);
    setScores((prev) => ({ ...prev, [playerInput.trim()]: Array(holeCount).fill("") }));
    setPlayerInput("");
  };

  const updateScore = (player: string, value: string) => {
    setScores((prev) => {
      const updated = [...prev[player]];
      updated[hole - 1] = value;
      return { ...prev, [player]: updated };
    });
  };

  const totalScore = (player: string) => {
    return scores[player]?.reduce((sum, val) => sum + (parseInt(val) || 0), 0) || 0;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-6 flex flex-col items-center">
        <img src="/icons/icon-192x192.png" alt="Hector Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-4xl font-bold mb-4 text-yellow-700">Hector Scores</h1>

        <div className="mb-4 w-full max-w-md">
