
import React from "react";

interface ScorecardProps {
  players: string[];
  scores: { [player: string]: string[] };
  holeCount: number;
  course: string;
  courses: Record<string, number[]>;
  totalScore: (player: string) => number;
}

const Scorecard: React.FC<ScorecardProps> = ({ players, scores, holeCount, course, courses, totalScore }) => {
  return (
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
            const current = scores[player] || [];
            const paddedScores = [...current, ...Array(holeCount - current.length).fill("")];
            return (
              <tr key={player} className="border-t">
                <td className="px-2 py-1 font-medium text-purple-200 whitespace-nowrap">{player}</td>
                {Array.from({ length: Number(holeCount) }).map((_, i) => {
                  const val = parseInt(paddedScores[i]);
                  const par = courses[course][i];
                  let style = "";
                  if (!isNaN(val)) {
                    if (val < par) style = "bg-red-100 text-red-800";
                    else if (val === par) style = "";
                    else if (val === par + 1) style = "bg-blue-100 text-blue-800";
                    else if (val >= par + 2) style = "bg-blue-200 text-blue-900";
                  }
                  return (
                    <td key={i} className={`px-2 py-1 text-center ${style}`}>{paddedScores[i]}</td>
                  );
                })}
                <td className="px-2 py-1 text-center font-bold">{totalScore(player)}</td>
                <td className="px-2 py-1 text-center font-bold">{
                  (() => {
                    const played = paddedScores.slice(0, holeCount).map((s) => parseInt(s)).filter(n => !isNaN(n));
                    if (played.length === 0) return "–";
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
  );
};

export default Scorecard;
