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
          <label className="block text-yellow-800 font-medium mb-1">Name this round (optional):</label>
          <input
            className="border border-yellow-500 rounded px-3 py-2 w-full"
            placeholder="e.g. Friday with Ville & Laura"
            value={roundName}
            onChange={(e) => setRoundName(e.target.value)}
          />
        </div>

        <div className="mb-6 w-full max-w-md">
  <label className="block text-yellow-800 font-medium mb-1">Select course:</label>
  <select
    className="border border-yellow-500 rounded px-3 py-2 w-full mb-4"
    value={course}
    onChange={(e) => setCourse(e.target.value)}
  >
    <option value="hirsala">Hirsala Golf</option>
    <option value="tapiola">Tapiola Golf</option>
  </select>

  <label className="block text-yellow-800 font-medium mb-1">Select number of holes:</label>
  <select
    className="border border-yellow-500 rounded px-3 py-2 w-full"
    value={holeCount}
    onChange={(e) => setHoleCount(Number(e.target.value))}
  >
    <option value={9}>9</option>
    <option value={18}>18</option>
  </select>
</div>

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

        {players.length > 0 && (
          <button
            className="px-6 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 shadow-md"
            onClick={() => {
              localStorage.setItem("hector-round-name", roundName);
              setStarted(true);
            }}
          >
            Start Round
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-6">
      <div className="flex justify-end mb-4 max-w-xl mx-auto gap-2">
  <button
    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 shadow"
    onClick={() => {
      const savedRounds = JSON.parse(localStorage.getItem("hector-history") || "[]");
      const newRound = {
        name: roundName || "Unnamed Round",
        date: new Date().toISOString().slice(0, 10),
        holeCount,
        scores
      };
      localStorage.setItem("hector-history", JSON.stringify([...savedRounds, newRound]));
      alert("Round saved!");
    }}
  >
    Save Round
  </button>
</div>
<div className="flex justify-end mb-4 max-w-xl mx-auto">
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 shadow"
          onClick={() => {
            setPlayers([]);
            setScores({});
            setHole(1);
            setStarted(false);
            localStorage.removeItem("hector-players");
            localStorage.removeItem("hector-scores");
            localStorage.removeItem("hector-round-name");
          }}
        >
          New Round
        </button>
      </div>
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Previous Rounds</h2>
          <ul className="text-sm text-yellow-900 space-y-1">
            {JSON.parse(localStorage.getItem("hector-history") || "[]").map((r: any, idx: number) => (
              <li key={idx} className="border border-yellow-200 rounded px-3 py-2 bg-white shadow-sm">
                <strong>{r.name}</strong> — {r.date}, {r.holeCount} holes, {Object.keys(r.scores).length} players
              </li>
            ))}
          </ul>
        </div>
        <h1 className="text-3xl font-extrabold text-yellow-800 text-center mb-1">{roundName || "Unnamed Round"}</h1>
        <p className="text-md text-yellow-600 text-center mb-5">Hole {hole} / {holeCount}</p>
        {players.map((player) => (
          <div key={player} className="bg-white border border-yellow-200 shadow-sm rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-yellow-900">{player}</span>
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
        <h2 className="text-2xl font-semibold mt-8 mb-3 text-yellow-800 text-center">Scorecard</h2>
        <div className="overflow-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-yellow-100 text-yellow-800">
              <tr>
                <th className="px-2 py-1 text-left">Player</th>
                {[...Array(holeCount)].map((_, i) => (
                  <th key={i} className="px-2 py-1 text-center">{i + 1}</th>
                ))}
                <th className="px-2 py-1 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player} className="border-t">
                  <td className="px-2 py-1 font-medium text-yellow-900 whitespace-nowrap">{player}</td>
                  {[...Array(holeCount)].map((_, i) => (
                  <td key={i} className={`px-2 py-1 text-center ${(() => {
                    const val = parseInt(scores[player][i]);
                    const par = courses[course][i];
                    if (!val) return '';
                    if (val < par) return 'bg-red-100 text-red-800';
if (val === par) return '';
if (val === par + 1) return 'bg-blue-100 text-blue-800';
if (val >= par + 2) return 'bg-blue-200 text-blue-900';
                  })()}`}>{scores[player][i] || ''}</td>
                ))}
                  <td className="px-2 py-1 text-center font-bold">{totalScore(player)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
