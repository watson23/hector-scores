import { useState } from "react";
import "./index.css";

export default function GolfScoreApp() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState("");
  const [scores, setScores] = useState<{ [player: string]: number[] }>({});
  const [hole, setHole] = useState(1);
  const [started, setStarted] = useState(false);

  const addPlayer = () => {
    if (playerInput.trim() === "") return;
    const newPlayers = [...players, playerInput.trim()];
    setPlayers(newPlayers);
    setScores((prev) => ({ ...prev, [playerInput.trim()]: Array(18).fill(0) }));
    setPlayerInput("");
  };

  const updateScore = (player: string, value: number) => {
    setScores((prev) => {
      const updated = [...prev[player]];
      updated[hole - 1] = value;
      return { ...prev, [player]: updated };
    });
  };

  const totalScore = (player: string) => scores[player]?.reduce((a, b) => a + b, 0) || 0;

  if (!started) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Golf Score Tracker</h1>
        <div className="flex mb-2">
          <input
            className="border rounded px-2 py-1 flex-grow mr-2"
            placeholder="Enter player name"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
          />
          <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={addPlayer}>Add</button>
        </div>
        <ul className="mb-4">
          {players.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {players.length > 0 && <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setStarted(true)}>Start Round</button>}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hole {hole}</h1>
      {players.map((player) => (
        <div key={player} className="bg-white shadow rounded p-4 mb-2 flex justify-between items-center">
          <span>{player}</span>
          <input
            type="number"
            className="border rounded px-2 py-1 w-16 text-center"
            value={scores[player][hole - 1]}
            onChange={(e) => updateScore(player, parseInt(e.target.value) || 0)}
          />
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button className="px-4 py-1 bg-gray-300 rounded" disabled={hole <= 1} onClick={() => setHole(hole - 1)}>Previous</button>
        <button className="px-4 py-1 bg-gray-300 rounded" disabled={hole >= 18} onClick={() => setHole(hole + 1)}>Next</button>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-2">Total Scores</h2>
      <ul>
        {players.map((player) => (
          <li key={player} className="mb-1">
            {player}: {totalScore(player)}
          </li>
        ))}
      </ul>
    </div>
  );
}
