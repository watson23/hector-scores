import React, { useState, useMemo } from "react";
import { Player, Scores, CourseData } from "./types";
import { courseDisplayName } from "./data/courses";
import { calculateNetScore } from "./utils/scoring";

interface ScorecardProps {
  players: Player[];
  scores: Scores;
  holeCount: number;
  course: string;
  courses: Record<string, CourseData>;
  totalScore: (playerName: string, useNet?: boolean) => number;
  getStrokesOnHole: (playerHandicap: number, holeNumber: number) => number;
}

const Scorecard: React.FC<ScorecardProps> = ({
  players,
  scores,
  holeCount,
  course,
  courses,
  totalScore,
  getStrokesOnHole,
}) => {
  const [showNet, setShowNet] = useState(false);
  const courseData = courses[course];

  const leaderboard = useMemo(() => {
    return players
      .map((player) => ({
        ...player,
        gross: totalScore(player.name, false),
        net: totalScore(player.name, true),
        played:
          scores[player.name]
            ?.slice(0, holeCount)
            .filter((s) => s && !isNaN(parseInt(s))).length || 0,
      }))
      .filter((player) => player.played > 0)
      .sort((a, b) => (showNet ? a.net : a.gross) - (showNet ? b.net : b.gross));
  }, [players, scores, holeCount, showNet, totalScore]);

  if (!courseData) return null;

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-800 rounded-full p-1 flex">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !showNet ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setShowNet(false)}
          >
            Gross
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              showNet ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setShowNet(true)}
          >
            Net
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-slate-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 text-center uppercase tracking-wide">
              {showNet ? "Net" : "Gross"} Leaderboard
            </h3>
          </div>
          <div>
            {leaderboard.map((player, index) => (
              <div
                key={player.name}
                className={`flex justify-between items-center px-4 py-3 ${
                  index !== leaderboard.length - 1 ? "border-b border-slate-700/50" : ""
                } ${index === 0 ? "border-l-2 border-l-amber-400" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold w-6 ${
                      index === 0 ? "text-amber-400" : "text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-white font-medium">{player.name}</span>
                  <span className="text-xs text-slate-500">HCP {player.handicap}</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${index === 0 ? "text-amber-400" : "text-white"}`}>
                    {showNet ? player.net : player.gross}
                  </div>
                  <div className="text-xs text-slate-500">{player.played} holes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Scorecard */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="min-w-fit text-xs w-full">
          <thead>
            <tr className="bg-slate-700 text-slate-300">
              <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                Player
              </th>
              {Array.from({ length: Number(holeCount) }).map((_, i) => (
                <th key={i} className="px-1.5 py-2 text-center font-semibold">
                  {i + 1}
                </th>
              ))}
              <th className="px-2 py-2 text-center font-semibold">Tot</th>
              <th className="px-2 py-2 text-center font-semibold">+/-</th>
            </tr>
            <tr className="bg-slate-700/50 text-slate-400">
              <td className="px-2 py-1 text-left text-xs">Par</td>
              {Array.from({ length: Number(holeCount) }).map((_, i) => (
                <td key={i} className="px-1.5 py-1 text-center">
                  {courseData.par[i]}
                </td>
              ))}
              <td className="px-2 py-1 text-center font-semibold">
                {courseData.par.slice(0, holeCount).reduce((sum, val) => sum + val, 0)}
              </td>
              <td className="px-2 py-1 text-center">-</td>
            </tr>
            <tr className="bg-slate-700/30 text-slate-500">
              <td className="px-2 py-1 text-left text-xs">HCP</td>
              {Array.from({ length: Number(holeCount) }).map((_, i) => (
                <td key={i} className="px-1.5 py-1 text-center">
                  {courseData.handicapIndex[i]}
                </td>
              ))}
              <td className="px-2 py-1 text-center">-</td>
              <td className="px-2 py-1 text-center">-</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const current = scores[player.name] || [];
              const paddedScores = [...current, ...Array(holeCount - current.length).fill("")];

              return (
                <tr key={player.name} className="border-t border-slate-700/50">
                  <td className="px-2 py-1.5 text-white font-medium whitespace-nowrap">
                    {player.name}
                    <div className="text-xs text-slate-500">{player.handicap}</div>
                  </td>
                  {Array.from({ length: Number(holeCount) }).map((_, i) => {
                    const grossScore = parseInt(paddedScores[i]);
                    const par = courseData.par[i];
                    const strokes = getStrokesOnHole(player.handicap, i + 1);
                    const netScore = !isNaN(grossScore)
                      ? calculateNetScore(grossScore, strokes)
                      : NaN;

                    let color = "text-slate-300";
                    const scoreToCompare = showNet ? netScore : grossScore;

                    if (!isNaN(scoreToCompare)) {
                      if (scoreToCompare < par) color = "text-red-400 font-bold";
                      else if (scoreToCompare === par) color = "text-emerald-400";
                      else if (scoreToCompare === par + 1) color = "text-sky-400";
                      else if (scoreToCompare >= par + 2) color = "text-sky-600";
                    }

                    return (
                      <td key={i} className={`px-1.5 py-1.5 text-center ${color} relative`}>
                        <div>
                          {showNet && !isNaN(netScore) ? netScore : paddedScores[i]}
                        </div>
                        {strokes > 0 && (
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                        )}
                        {!showNet && !isNaN(grossScore) && strokes > 0 && (
                          <div className="text-xs text-slate-500">({netScore})</div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-center font-bold text-white">
                    {showNet ? totalScore(player.name, true) : totalScore(player.name, false)}
                  </td>
                  <td className="px-2 py-1.5 text-center font-bold">
                    {(() => {
                      const relevantScores = paddedScores.slice(0, holeCount);
                      const played = relevantScores
                        .map((s) => parseInt(s))
                        .filter((n) => !isNaN(n));
                      if (played.length === 0) return "-";

                      const parPlayed = courseData.par
                        .slice(0, played.length)
                        .reduce((sum, val) => sum + val, 0);

                      let scorePlayed;
                      if (showNet) {
                        scorePlayed = relevantScores.reduce((sum, scoreStr, index) => {
                          const score = parseInt(scoreStr);
                          if (isNaN(score)) return sum;
                          const strokes = getStrokesOnHole(player.handicap, index + 1);
                          return sum + calculateNetScore(score, strokes);
                        }, 0);
                      } else {
                        scorePlayed = played.reduce((sum, val) => sum + val, 0);
                      }

                      const diff = scorePlayed - parPlayed;
                      if (diff > 0) return <span className="text-sky-400">+{diff}</span>;
                      if (diff < 0) return <span className="text-red-400">{diff}</span>;
                      return <span className="text-emerald-400">E</span>;
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Course Info */}
        <div className="px-4 py-3 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            {courseDisplayName(course)} &middot; Rating {courseData.rating} &middot; Slope{" "}
            {courseData.slope}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
