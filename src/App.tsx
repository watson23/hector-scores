import { useEffect, useState } from "react";
import "./index.css";

export default function GolfScoreApp() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState("");
  const [scores, setScores] = useState<{ [player: string]: number[] }>({});
  const [holeCount, setHoleCount] = useState(18);
  const [hole, setHole] = useState(1);
  const [started, setStarted] = useState(false);

  useEffect(() => {
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
      <div className="mb-4">
        <label className="block text-yellow-800 font-medium mb-1">Select number of holes:</label>
        <select
          className="border border-yellow-500 rounded px-3 py-2"
          value={holeCount}
          onChange={(e) => setHoleCount(Number(e.target.value))}
        >
          <option value={9}>9</option>
          <option value={18}>18</option>
        </select>
      </div>,
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-6 flex flex-col items-center">
        <img src="/icons/icon-192x192.png" alt="Hector Logo" className="w-16 h-16 mb-2" />
        <h1 className="text-4xl font-bold mb-6 text-yellow-700">Hector Scores</h1>
        <div className="flex mb-4 w-full max-w-md">
          <input
            className="border border-yellow-500 rounded-l px-4 py-2 w-full focus:outline-none"
            placeholder="Enter player name"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
          />
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-r hover:bg-yellow-700" onClick={addPlayer}>Add</button>
        </div>
        <ul className="text-yellow-800 mb-6">
          {players.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {players.length > 0 && <button className="px-6 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 shadow-md" onClick={() => setStarted(true)}>Start Round</button>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-green-800 text-center">Hole {hole}</h1>
        {players.map((player) => (
          <div key={player} className="bg-white border border-yellow-200 shadow-sm rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-yellow-800">{player}</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="border border-yellow-300 rounded px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={scores[player][hole - 1]}
                onChange={(e) => updateScore(player, e.target.value.replace(/^0+(?!$)/, ""))}
              />
            </div>
            <div className="text-sm text-gray-500">
              Scores: {scores[player].map((s, i) => s ? `${i + 1}:${s}` : null).filter(Boolean).join(", ") || "-"}
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow" disabled={hole <= 1} onClick={() => setHole(hole - 1)}>Previous</button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow" disabled={hole >= holeCount} onClick={() => setHole(hole + 1)}>Next</button>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-3 text-yellow-800 text-center">Total Scores</h2>
        <ul className="bg-white rounded-lg p-4 shadow">
          {players.map((player) => (
            <li key={player} className="mb-2 flex justify-between border-b pb-1">
              <span>{player}</span>
              <span className="font-bold">{totalScore(player)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
