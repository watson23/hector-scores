import { useEffect, useState } from "react";
import StartScreen from "./StartScreen";
import ScoreInput from "./ScoreInput";
import Scorecard from "./Scorecard";
import RoundHistory from "./RoundHistory";
import { Player, Scores } from "./types";
import { courses, courseDisplayName } from "./data/courses";
import { getStrokesOnHole as getStrokesOnHoleUtil } from "./handicap";
import { saveRound } from "./utils/storage";
import { calculateTotalScore } from "./utils/scoring";
import "./index.css";

type AppView = "start" | "playing" | "history";

export default function GolfScoreApp() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Scores>({});
  const [hole, setHole] = useState(1);
  const [holeCount, setHoleCount] = useState(18);
  const [view, setView] = useState<AppView>("start");
  const [roundName, setRoundName] = useState("");
  const [course, setCourse] = useState("hirsala");

  const courseData = courses[course];

  const getStrokesOnHole = (playerHandicap: number, holeNumber: number) => {
    return getStrokesOnHoleUtil(playerHandicap, courseData, holeNumber);
  };

  // Pad scores array when hole count or players change
  useEffect(() => {
    let needsUpdate = false;
    const filledScores: Scores = {};
    players.forEach((player) => {
      const current = scores[player.name] || [];
      if (current.length < holeCount) {
        filledScores[player.name] = [
          ...current,
          ...Array.from({ length: holeCount - current.length }, () => ""),
        ];
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
    return calculateTotalScore(playerName, scores, holeCount, players, courseData, useNet);
  };

  // --- Views ---

  if (view === "history") {
    return (
      <RoundHistory
        onBack={() => setView("start")}
        courses={courses}
        onLoadRound={(round) => {
          setCourse(round.course);
          setHoleCount(round.holeCount);
          setRoundName(round.name);
          setPlayers(round.players);
          setScores(round.scores);
          setHole(1);
          setView("playing");
        }}
      />
    );
  }

  if (view === "start") {
    return (
      <StartScreen
        course={course}
        setCourse={setCourse}
        holeCount={holeCount}
        setHoleCount={setHoleCount}
        roundName={roundName}
        setRoundName={setRoundName}
        players={players}
        setPlayers={setPlayers}
        scores={scores}
        setScores={setScores}
        onStart={() => setView("playing")}
        onShowHistory={() => setView("history")}
      />
    );
  }

  const courseName = courseDisplayName(course);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
        <button
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          onClick={() => {
            setPlayers([]);
            setScores({});
            setHole(1);
            setView("start");
            setRoundName("");
          }}
        >
          New Round
        </button>
        <span className="text-white font-semibold text-sm truncate mx-3">
          {roundName || "Unnamed Round"}
        </span>
        <button
          className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-500 transition-colors"
          onClick={() => {
            saveRound({
              name: roundName || "Unnamed Round",
              date: new Date().toISOString().slice(0, 10),
              holeCount,
              course,
              players,
              scores,
            });
            alert("Round saved!");
          }}
        >
          Save
        </button>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Hole indicator with navigation */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
            disabled={hole <= 1}
            onClick={() => setHole(hole - 1)}
          >
            &#8249;
          </button>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">Hole {hole}</div>
            <div className="text-xs text-slate-400 font-medium">
              {courseName} &middot; {hole} / {holeCount}
            </div>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-colors"
            disabled={hole >= holeCount}
            onClick={() => setHole(hole + 1)}
          >
            &#8250;
          </button>
        </div>

        {/* Par and HCP pills */}
        <div className="flex justify-center gap-2 mb-5">
          <span className="text-xs font-semibold bg-emerald-900 text-emerald-400 px-3 py-1 rounded-full">
            Par {courseData.par[hole - 1]}
          </span>
          <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-3 py-1 rounded-full">
            HCP {courseData.handicapIndex[hole - 1]}
          </span>
        </div>

        {/* Score inputs */}
        {players.map((player) => {
          const strokes = getStrokesOnHole(player.handicap, hole);
          return (
            <ScoreInput
              key={player.name}
              player={player.name}
              playerHandicap={player.handicap}
              strokesOnHole={strokes}
              value={scores[player.name]?.[hole - 1] ?? ""}
              onScoreChange={(value) => updateScore(player.name, value)}
            />
          );
        })}

        {/* Scorecard section */}
        <div className="mt-6 pt-6 border-t border-slate-800">
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
    </div>
  );
}
