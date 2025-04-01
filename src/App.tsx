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
    vuosaari: [4, 4, 3, 5, 4, 4, 4, 4, 5, 5, 4, 5, 3, 4, 3, 4, 3, 4]
  };

  useEffect(() => {
    let needsUpdate = false;
    const filledScores: typeof scores = {};
    players.forEach((p) => {
      const current = scores[p] || [];
      if (current.length < holeCount) {
        filledScores[p] = [...current, ...Array.from({ length: holeCount - current.length }, () => "")];
        needsUpdate = true;
      } else {
        filledScores[p] = current;
      }
    });
    if (needsUpdate) {
      setScores(filledScores);
    }
  }, [players, holeCount, scores]);

  const updateScore = (player: string, value: string) => {
    setScores((prev) => {
      const updated = [...prev[player]];
      updated[hole - 1] = value.replace(/^0+(?!$)/, "");
      return { ...prev, [player]: updated };
    });
  };

  const totalScore = (player: string) => {
    const relevantScores = scores[player]?.slice(0, holeCount) || [];
    return relevantScores.reduce((sum, val) => {
      const parsed = parseInt(val);
      return sum + (isNaN(parsed) ? 0 : parsed);
    }, 0);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col items-center mb-6">
  <img src="/icons/icon-192x192.png" alt="Hector Icon" className="w-16 h-16 mb-2" />
  <h1 className="text-3xl font-bold text-purple-300 text-center">Hector Scores</h1>
</div>

          <div className="mb-6 w-full max-w-md">
            <label className="block text-purple-200 font-medium mb-1">Select course:</label>
            <select
              className="border border-purple-400 rounded px-3 py-2 w-full mb-4"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="hirsala">Hirsala Golf</option>
              <option value="tapiola">Tapiola Golf</option>
            </select>

            <label className="block text-purple-200 font-medium mb-1">Select number of holes:</label>
            <select
              className="border border-yellow-500 rounded px-3 py-2 w-full"
              value={holeCount}
              onChange={(e) => setHoleCount(Number(e.target.value))}
            >
              <option value={9}>9</option>
              <option value={18}>18</option>
            </select>
          </div>

          <div className="mb-4 w-full max-w-md">
            <label className="block text-purple-300 font-medium mb-1">Round name:</label>
            <input
              type="text"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              className="border border-yellow-500 rounded px-3 py-2 w-full"
              placeholder="e.g. Friday with Ville & Laura"
            />
          </div>

          <div className="flex mb-4">
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              className="border border-purple-400 rounded-l px-3 py-2 w-full"
              placeholder="Add player"
            />
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-r hover:bg-purple-700"
              onClick={() => {
                if (playerInput.trim() && !players.includes(playerInput.trim())) {
                  setPlayers([...players, playerInput.trim()]);
                  setScores({ ...scores, [playerInput.trim()]: Array(holeCount).fill("") });
                  setPlayerInput("");
                }
              }}
            >
              Add
            </button>
          </div>

          {players.length > 0 && (
            <ul className="mb-4">
              {players.map((p) => (
                <li key={p} className="text-yellow-800 text-sm">{p}</li>
              ))}
            </ul>
          )}

          {players.length > 0 && (
            <button
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 shadow-md w-full"
              onClick={() => setStarted(true)}
            >
              Start Round
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-6">
      <div className="flex justify-center gap-4 mb-6 max-w-md mx-auto">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 shadow"
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
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 shadow"
          onClick={() => {
            setPlayers([]);
            setScores({});
            setHole(1);
            setStarted(false);
            setRoundName("");
          }}
        >
          New Round
        </button>
      </div>

      <div className="w-full overflow-x-auto xl:overflow-visible xl:max-w-none px-2">
        <h1 className="text-3xl font-extrabold text-purple-200 text-center mb-1">{roundName || "Unnamed Round"}</h1>
        <p className="text-md text-purple-400 text-center mb-5">Hole {hole} / {holeCount}</p>

        <h2 className="text-xl font-semibold text-purple-100 text-center mb-2">Hole {hole}</h2>
        {players.map((player) => (
          <div key={player} className="bg-gray-50 border border-purple-300 shadow-sm rounded-3xl p-6 mb-6 max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-purple-800">{player}</span>
              <div className="flex flex-wrap gap-2 justify-end">
  {["1","2","3","4","5","6","7","8","9","-"].map((n) => (
    <button
      key={n}
      className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
      onClick={() => updateScore(player, n === "-" ? "" : n)}
    >
      {n}
    </button>
  ))}
  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    placeholder="10+"
    className="border border-purple-300 rounded px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-purple-400"
    value={scores[player][hole - 1]}
    onChange={(e) => updateScore(player, e.target.value)}
  />
</div>
            </div>
            
          </div>
        ))}

        <div className="flex justify-center gap-4 mt-4 mb-8 max-w-md mx-auto">
  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow" disabled={hole <= 1} onClick={() => setHole(hole - 1)}>Previous</button>
  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow" disabled={hole >= holeCount} onClick={() => setHole(hole + 1)}>Next</button>
</div>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-purple-200 text-center">Scorecard</h2>
        <div className="bg-white rounded-3xl shadow p-6 max-w-5xl mx-auto xl:overflow-visible overflow-x-auto">
          <table className="min-w-fit text-sm">
            <thead className="bg-purple-800 text-white">
              <tr>
                <th className="px-2 py-1 text-left">Player</th>
                {Array.from({ length: Number(holeCount) }).map((_, i) => (
                  <th key={i} className="px-2 py-1 text-center">{i + 1}</th>
                ))}
                <th className="px-2 py-1 text-center">Total</th>
                <th className="px-2 py-1 text-center">± Par</th>
              </tr>
              <tr className="bg-gray-50 text-gray-700 font-semibold">
                <td className="px-2 py-1 text-left">Par</td>
                {Array.from({ length: Number(holeCount) }).map((_, i) => (
                  <td key={i} className="px-2 py-1 text-center">{courses[course][i]}</td>
                ))}
                <td className="px-2 py-1 text-center">{courses[course].slice(0, holeCount).reduce((sum, val) => sum + val, 0)}</td>
                <td className="px-2 py-1 text-center">–</td>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                if (scores[player].length < holeCount) {
                  scores[player] = [...scores[player], ...Array(holeCount - scores[player].length).fill("")];
                }
                return (
                  <tr key={player} className="border-t">
                    <td className="px-2 py-1 font-medium text-purple-200 whitespace-nowrap">{player}</td>
                    {Array.from({ length: Number(holeCount) }).map((_, i) => {
                      const val = parseInt(scores[player][i]);
                      const par = courses[course][i];
                      let style = "";
                      if (!isNaN(val)) {
                        if (val < par) style = "bg-red-100 text-red-800";
                        else if (val === par) style = "";
                        else if (val === par + 1) style = "bg-blue-100 text-blue-800";
                        else if (val >= par + 2) style = "bg-blue-200 text-blue-900";
                      }
                      return (
                        <td key={i} className={`px-2 py-1 text-center ${style}`}>{scores[player][i] || ""}</td>
                      );
                    })}
                    <td className="px-2 py-1 text-center font-bold">{totalScore(player)}</td>
                    <td className="px-2 py-1 text-center font-bold">{
                      (() => {
                        const played = scores[player]?.slice(0, holeCount).map((s) => parseInt(s)).filter(n => !isNaN(n));
                        if (!played || played.length === 0) return "–";
                        const parPlayed = courses[course].slice(0, played.length).reduce((sum, val) => sum + val, 0);
                        const scorePlayed = played.reduce((sum, val) => sum + val, 0);
                        const diff = scorePlayed - parPlayed;
                        return diff > 0 ? `+${diff}` : diff;
                      })()
                    }</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
