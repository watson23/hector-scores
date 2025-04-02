
import { useEffect, useState } from "react";
import StartScreen from "./StartScreen";
import ScoreInput from "./ScoreInput";
import Scorecard from "./Scorecard";
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
    vuosaari: [4, 4, 3, 5, 4, 4, 4, 4, 5, 5, 4, 5, 3, 4, 3, 4, 3, 4],
    gumböle: [5, 3, 4, 4, 3, 4, 3, 5, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3],
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
      <StartScreen
        course={course}
        setCourse={setCourse}
        holeCount={holeCount}
        setHoleCount={setHoleCount}
        roundName={roundName}
        setRoundName={setRoundName}
        playerInput={playerInput}
        setPlayerInput={setPlayerInput}
        players={players}
        setPlayers={setPlayers}
        scores={scores}
        setScores={setScores}
        onStart={() => setStarted(true)}
      />
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
              course,
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
        <p className="text-md text-purple-400 text-center mb-5">{course.charAt(0).toUpperCase() + course.slice(1)} – Hole {hole} / {holeCount}</p>

        <h2 className="text-xl font-semibold text-purple-100 text-center mb-2">Hole {hole}</h2>
        {players.map((player) => (
          <ScoreInput
            key={player}
            player={player}
            value={scores[player][hole - 1]}
            onScoreChange={(value) => updateScore(player, value)}
          />
        ))}

        <div className="flex justify-center gap-4 mt-4 mb-8 max-w-md mx-auto">
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow" disabled={hole <= 1} onClick={() => setHole(hole - 1)}>Previous</button>
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow" disabled={hole >= holeCount} onClick={() => setHole(hole + 1)}>Next</button>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-purple-200 text-center">Scorecard</h2>
        <Scorecard
          players={players}
          scores={scores}
          holeCount={holeCount}
          course={course}
          courses={courses}
          totalScore={totalScore}
        />
      </div>
    </div>
  );
}
