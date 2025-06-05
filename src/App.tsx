import { useEffect, useState } from "react";
import StartScreen from "./StartScreen";
import ScoreInput from "./ScoreInput";
import Scorecard from "./Scorecard";
import "./index.css";

export interface Player {
  name: string;
  handicap: number;
}

export default function GolfScoreApp() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerInput, setPlayerInput] = useState("");
  const [playerHandicap, setPlayerHandicap] = useState("");
  const [scores, setScores] = useState<{ [playerName: string]: string[] }>({});
  const [hole, setHole] = useState(1);
  const [holeCount, setHoleCount] = useState(18);
  const [started, setStarted] = useState(false);
  const [roundName, setRoundName] = useState("");
  const [course, setCourse] = useState("hirsala");

  const courses: Record<string, { 
    par: number[]; 
    handicapIndex: number[];
    rating: number;
    slope: number;
  }> = {
    hirsala: {
      par: [4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 4, 5, 4, 3, 5, 3, 4, 5],
      handicapIndex: [5, 17, 7, 1, 11, 9, 3, 15, 13, 6, 14, 2, 10, 18, 4, 16, 12, 8],
      rating: 74.4,
      slope: 134
    },
    tapiola: {
      par: [5, 3, 4, 3, 5, 4, 4, 4, 4, 4, 5, 4, 3, 4, 4, 4, 4, 4],
      handicapIndex: [1, 17, 9, 15, 3, 11, 7, 13, 5, 8, 2, 6, 18, 12, 14, 10, 16, 4],
      rating: 72.8,
      slope: 127
    },
    vuosaari: {
      par: [4, 4, 3, 5, 4, 4, 4, 4, 5, 5, 4, 5, 3, 4, 3, 4, 3, 4],
      handicapIndex: [7, 11, 17, 1, 9, 13, 5, 15, 3, 2, 12, 4, 18, 8, 16, 6, 14, 10],
      rating: 74.4,
      slope: 136
    },
    gumböle: {
      par: [5, 3, 4, 4, 3, 4, 3, 5, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3],
      handicapIndex: [1, 15, 11, 7, 17, 9, 13, 3, 5, 12, 8, 6, 18, 10, 16, 2, 4, 14],
      rating: 69.0,
      slope: 123
    }
  };

  // Calculate course handicap using World Handicap System formula
  const calculateCourseHandicap = (playerHandicap: number, courseData: typeof courses.hirsala) => {
    return Math.round(playerHandicap * (courseData.slope / 113));
  };

  // Get strokes received on each hole
  const getStrokesOnHole = (playerHandicap: number, holeNumber: number) => {
    const courseData = courses[course];
    const courseHandicap = calculateCourseHandicap(playerHandicap, courseData);
    const holeHandicapIndex = courseData.handicapIndex[holeNumber - 1];
    
    if (courseHandicap >= holeHandicapIndex) {
      return Math.floor(courseHandicap / 18) + (courseHandicap % 18 >= holeHandicapIndex ? 1 : 0);
    }
    return 0;
  };

  useEffect(() => {
    let needsUpdate = false;
    const filledScores: typeof scores = {};
    players.forEach((player) => {
      const current = scores[player.name] || [];
      if (current.length < holeCount) {
        filledScores[player.name] = [...current, ...Array.from({ length: holeCount - current.length }, () => "")];
        needsUpdate = true;
      } else {
        filledScores[player.name] = current;
      }
    });
    if (needsUpdate) {
      setScores(filledScores);
    }
  }, [players, holeCount, scores]);

  const updateScore = (playerName: string, value: string) => {
    setScores((prev) => {
      const updated = [...prev[playerName]];
      updated[hole - 1] = value.replace(/^0+(?!$)/, "");
      return { ...prev, [playerName]: updated };
    });
  };

  const totalScore = (playerName: string, useNet: boolean = false) => {
    const relevantScores = scores[playerName]?.slice(0, holeCount) || [];
    const player = players.find(p => p.name === playerName);
    
    return relevantScores.reduce((sum, val, index) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) return sum;
      
      let score = parsed;
      if (useNet && player) {
        const strokes = getStrokesOnHole(player.handicap, index + 1);
        score = Math.max(1, parsed - strokes); // Net score can't be less than 1
      }
      
      return sum + score;
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
        playerHandicap={playerHandicap}
        setPlayerHandicap={setPlayerHandicap}
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
              players,
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

        <h2 className="text-xl font-semibold text-purple-100 text-center mb-2">
          Hole {hole} (Par {courses[course].par[hole - 1]}, HCP {courses[course].handicapIndex[hole - 1]})
        </h2>
        
        {players.map((player) => {
          const strokes = getStrokesOnHole(player.handicap, hole);
          return (
            <ScoreInput
              key={player.name}
              player={player.name}
              playerHandicap={player.handicap}
              strokesOnHole={strokes}
              value={scores[player.name][hole - 1]}
              onScoreChange={(value) => updateScore(player.name, value)}
            />
          );
        })}

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
          getStrokesOnHole={getStrokesOnHole}
        />
      </div>
    </div>
  );
}
