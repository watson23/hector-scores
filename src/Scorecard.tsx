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

/** Color a score cell based on relation to par */
function scoreColor(score: number, par: number): string {
  if (score <= par - 2) return "text-amber-400 font-bold"; // eagle+
  if (score === par - 1) return "text-red-400 font-bold"; // birdie
  if (score === par) return "text-emerald-400"; // par
  if (score === par + 1) return "text-sky-400"; // bogey
  return "text-sky-600"; // double+
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

  // Split holes into 9-hole sections
  const sections: { label: string; start: number; end: number }[] = [];
  if (holeCount <= 9) {
    sections.push({ label: "", start: 0, end: holeCount });
  } else {
    sections.push({ label: "OUT", start: 0, end: 9 });
    if (holeCount > 9) {
      sections.push({ label: "IN", start: 9, end: holeCount });
    }
  }

  /** Render a 9-hole scorecard table */
  const renderSection = (start: number, end: number, label: string) => {
    const holeCount9 = end - start;
    const sectionPar = courseData.par.slice(start, end).reduce((s, v) => s + v, 0);

    return (
      <div key={label} className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: `${holeCount9 * 28 + 100}px` }}>
          <thead>
            {/* Hole numbers */}
            <tr className="bg-slate-700 text-slate-300">
              <th className="w-16 px-1.5 py-1.5 text-left font-semibold text-xs sticky left-0 bg-slate-700 z-10">
                {label || "Hole"}
              </th>
              {Array.from({ length: holeCount9 }).map((_, i) => (
                <th key={i} className="w-7 min-w-[28px] py-1.5 text-center font-semibold">
                  {start + i + 1}
                </th>
              ))}
              <th className="w-9 min-w-[36px] py-1.5 text-center font-bold bg-slate-600">
                {label || "Tot"}
              </th>
            </tr>
            {/* Par row */}
            <tr className="bg-slate-700/50 text-slate-400">
              <td className="px-1.5 py-1 text-left text-xs sticky left-0 bg-slate-700/50 z-10">
                Par
              </td>
              {Array.from({ length: holeCount9 }).map((_, i) => (
                <td key={i} className="py-1 text-center">
                  {courseData.par[start + i]}
                </td>
              ))}
              <td className="py-1 text-center font-semibold bg-slate-600/50">
                {sectionPar}
              </td>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const current = scores[player.name] || [];
              const paddedScores = [
                ...current,
                ...Array(Math.max(0, end - current.length)).fill(""),
              ];

              // Section subtotal
              let sectionTotal = 0;
              let sectionHasScore = false;
              for (let i = start; i < end; i++) {
                const val = parseInt(paddedScores[i]);
                if (!isNaN(val)) {
                  const strokes = getStrokesOnHole(player.handicap, i + 1);
                  sectionTotal += showNet ? calculateNetScore(val, strokes) : val;
                  sectionHasScore = true;
                }
              }

              return (
                <tr key={player.name} className="border-t border-slate-700/50">
                  <td className="px-1.5 py-1.5 text-white font-medium whitespace-nowrap text-xs sticky left-0 bg-slate-800 z-10">
                    {player.name}
                  </td>
                  {Array.from({ length: holeCount9 }).map((_, i) => {
                    const holeIdx = start + i;
                    const grossScore = parseInt(paddedScores[holeIdx]);
                    const par = courseData.par[holeIdx];
                    const strokes = getStrokesOnHole(player.handicap, holeIdx + 1);

                    if (isNaN(grossScore)) {
                      return (
                        <td key={i} className="py-1.5 text-center text-slate-600">
                          ·
                        </td>
                      );
                    }

                    const netScore = calculateNetScore(grossScore, strokes);
                    const displayScore = showNet ? netScore : grossScore;

                    const strokeBg = showNet && strokes > 0 ? "bg-amber-400/10" : "";

                    return (
                      <td
                        key={i}
                        className={`py-1.5 text-center ${scoreColor(displayScore, par)} ${strokeBg}`}
                      >
                        {displayScore}
                      </td>
                    );
                  })}
                  <td className="py-1.5 text-center font-bold text-white bg-slate-700/30">
                    {sectionHasScore ? sectionTotal : "·"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Calculate overall totals for the summary row
  const totalPar = courseData.par.slice(0, holeCount).reduce((s, v) => s + v, 0);

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

      {/* Hole-by-hole scorecards — split by 9 */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-700">
          {sections.map((sec) => renderSection(sec.start, sec.end, sec.label))}
        </div>

        {/* Total summary row */}
        {holeCount > 9 && (
          <div className="border-t border-slate-600">
            <table className="w-full text-xs">
              <tbody>
                {/* Total par */}
                <tr className="bg-slate-700/50 text-slate-400">
                  <td className="w-16 px-1.5 py-1.5 text-left font-semibold">Total</td>
                  <td className="py-1.5 text-center font-semibold">
                    Par {totalPar}
                  </td>
                  {players.map((player) => {
                    const score = showNet
                      ? totalScore(player.name, true)
                      : totalScore(player.name, false);
                    const played = scores[player.name]
                      ?.slice(0, holeCount)
                      .filter((s) => s && !isNaN(parseInt(s))).length || 0;
                    if (played === 0) return <td key={player.name} />;

                    const parPlayed = courseData.par
                      .slice(0, holeCount)
                      .reduce((sum, val, idx) => {
                        const s = scores[player.name]?.[idx];
                        return s && !isNaN(parseInt(s)) ? sum + val : sum;
                      }, 0);
                    const diff = score - parPlayed;

                    return (
                      <td key={player.name} className="py-1.5 text-center">
                        <span className="text-white font-bold">{score}</span>
                        <span
                          className={`ml-1 ${
                            diff > 0
                              ? "text-sky-400"
                              : diff < 0
                                ? "text-red-400"
                                : "text-emerald-400"
                          }`}
                        >
                          ({diff > 0 ? "+" : ""}
                          {diff === 0 ? "E" : diff})
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Course Info */}
        <div className="px-4 py-2.5 border-t border-slate-700 text-center">
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
