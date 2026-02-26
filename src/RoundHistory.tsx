import React, { useState } from "react";
import { SavedRound, CourseData } from "./types";
import { courseDisplayName } from "./data/courses";
import { getStrokesOnHole as getStrokesOnHoleUtil } from "./handicap";
import { getRounds, deleteRound as deleteRoundFromStorage } from "./utils/storage";
import { calculateNetScore } from "./utils/scoring";

interface RoundHistoryProps {
  onBack: () => void;
  onLoadRound: (round: SavedRound) => void;
  courses: Record<string, CourseData>;
}

const RoundHistory: React.FC<RoundHistoryProps> = ({ onBack, onLoadRound, courses }) => {
  const [rounds, setRounds] = useState<SavedRound[]>(getRounds);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showNet, setShowNet] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const totalPar = (round: SavedRound) => {
    const courseData = courses[round.course];
    if (!courseData) return 0;
    return courseData.par.slice(0, round.holeCount).reduce((sum, val) => sum + val, 0);
  };

  const playerGross = (round: SavedRound, playerName: string) => {
    const s = round.scores[playerName] || [];
    return s.slice(0, round.holeCount).reduce((sum, val) => {
      const n = parseInt(val);
      return isNaN(n) ? sum : sum + n;
    }, 0);
  };

  const getStrokesOnHole = (playerHandicap: number, course: string, holeNumber: number) => {
    const courseData = courses[course];
    if (!courseData) return 0;
    return getStrokesOnHoleUtil(playerHandicap, courseData, holeNumber);
  };

  const playerNet = (round: SavedRound, player: { name: string; handicap: number }) => {
    const s = round.scores[player.name] || [];
    return s.slice(0, round.holeCount).reduce((sum, val, index) => {
      const n = parseInt(val);
      if (isNaN(n)) return sum;
      const strokes = getStrokesOnHole(player.handicap, round.course, index + 1);
      return sum + calculateNetScore(n, strokes);
    }, 0);
  };

  const holesPlayedCount = (round: SavedRound, playerName: string) => {
    const s = round.scores[playerName] || [];
    return s.slice(0, round.holeCount).filter((v) => v && !isNaN(parseInt(v))).length;
  };

  const deleteRound = (index: number) => {
    const updated = deleteRoundFromStorage(index);
    setRounds(updated);
    setConfirmDelete(null);
    setExpandedIndex(null);
  };

  const getWinner = (round: SavedRound, useNet: boolean) => {
    let best = { name: "", score: Infinity };
    round.players.forEach((player) => {
      const played = holesPlayedCount(round, player.name);
      if (played === 0) return;
      const score = useNet ? playerNet(round, player) : playerGross(round, player.name);
      if (score < best.score) {
        best = { name: player.name, score };
      }
    });
    return best.name;
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
            onClick={onBack}
          >
            Back
          </button>
          <h1 className="text-xl font-bold text-white">Round History</h1>
          <div className="w-16"></div>
        </div>

        {rounds.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white text-lg font-medium mb-2">No saved rounds yet</p>
            <p className="text-slate-500 text-sm">Play a round and save it to see it here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...rounds].reverse().map((round, reverseIndex) => {
              const realIndex = rounds.length - 1 - reverseIndex;
              const isExpanded = expandedIndex === realIndex;
              const courseData = courses[round.course];
              const par = totalPar(round);
              const winner = getWinner(round, false);

              return (
                <div key={realIndex} className="bg-slate-800 rounded-2xl overflow-hidden">
                  {/* Summary row */}
                  <button
                    className="w-full text-left p-4 hover:bg-slate-700/50 transition-colors"
                    onClick={() => setExpandedIndex(isExpanded ? null : realIndex)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold">
                          {round.name || "Unnamed Round"}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {round.date} &middot; {courseDisplayName(round.course)}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {round.holeCount} holes &middot; {round.players.length} player
                          {round.players.length !== 1 ? "s" : ""}
                          {winner && (
                            <span className="text-amber-400 ml-2">&#9679; {winner}</span>
                          )}
                        </p>
                      </div>
                      <span className="text-slate-500 text-lg">
                        {isExpanded ? "&#9662;" : "&#9656;"}
                      </span>
                    </div>

                    {/* Quick scores preview */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {round.players.map((player) => {
                        const gross = playerGross(round, player.name);
                        const played = holesPlayedCount(round, player.name);
                        const diff =
                          gross -
                          (courseData
                            ? courseData.par.slice(0, played).reduce((s, v) => s + v, 0)
                            : 0);
                        return (
                          <span key={player.name} className="text-sm">
                            <span className="text-slate-400">{player.name}</span>
                            <span className="text-white font-medium ml-1">{gross}</span>
                            {played > 0 && (
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
                                {diff})
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-700 p-4">
                      {/* Net/Gross toggle */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-slate-900 rounded-full p-1 flex">
                          <button
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              !showNet ? "bg-emerald-600 text-white" : "text-slate-400"
                            }`}
                            onClick={() => setShowNet(false)}
                          >
                            Gross
                          </button>
                          <button
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              showNet ? "bg-emerald-600 text-white" : "text-slate-400"
                            }`}
                            onClick={() => setShowNet(true)}
                          >
                            Net
                          </button>
                        </div>
                      </div>

                      {/* Scorecard table */}
                      <div className="overflow-x-auto -mx-4 px-4">
                        <table className="min-w-fit text-xs w-full">
                          <thead>
                            <tr className="bg-slate-700 text-slate-300">
                              <th className="px-2 py-1.5 text-left text-xs font-semibold">Hole</th>
                              {Array.from({ length: round.holeCount }).map((_, i) => (
                                <th key={i} className="px-1.5 py-1.5 text-center font-semibold">
                                  {i + 1}
                                </th>
                              ))}
                              <th className="px-2 py-1.5 text-center font-bold">Tot</th>
                              <th className="px-2 py-1.5 text-center">+/-</th>
                            </tr>
                            {courseData && (
                              <tr className="bg-slate-700/50 text-slate-400">
                                <td className="px-2 py-1 text-left">Par</td>
                                {Array.from({ length: round.holeCount }).map((_, i) => (
                                  <td key={i} className="px-1.5 py-1 text-center">
                                    {courseData.par[i]}
                                  </td>
                                ))}
                                <td className="px-2 py-1 text-center font-bold">{par}</td>
                                <td className="px-2 py-1 text-center">-</td>
                              </tr>
                            )}
                          </thead>
                          <tbody>
                            {round.players
                              .map((player) => ({
                                player,
                                score: showNet
                                  ? playerNet(round, player)
                                  : playerGross(round, player.name),
                                played: holesPlayedCount(round, player.name),
                              }))
                              .sort((a, b) => a.score - b.score)
                              .map(({ player, score, played }) => {
                                const s = round.scores[player.name] || [];
                                const parPlayed = courseData
                                  ? courseData.par
                                      .slice(0, played)
                                      .reduce((sum, v) => sum + v, 0)
                                  : 0;
                                const diff = score - parPlayed;

                                return (
                                  <tr
                                    key={player.name}
                                    className="border-t border-slate-700/50"
                                  >
                                    <td className="px-2 py-1 text-white font-medium whitespace-nowrap">
                                      {player.name}
                                      <span className="text-slate-500 text-xs ml-1">
                                        ({player.handicap})
                                      </span>
                                    </td>
                                    {Array.from({ length: round.holeCount }).map((_, i) => {
                                      const gross = parseInt(s[i]);
                                      if (isNaN(gross))
                                        return (
                                          <td
                                            key={i}
                                            className="px-1.5 py-1 text-center text-slate-600"
                                          >
                                            -
                                          </td>
                                        );

                                      const strokes = getStrokesOnHole(
                                        player.handicap,
                                        round.course,
                                        i + 1,
                                      );
                                      const net = calculateNetScore(gross, strokes);
                                      const displayScore = showNet ? net : gross;
                                      const holePar = courseData?.par[i] || 0;

                                      let color = "text-slate-300";
                                      if (displayScore < holePar)
                                        color = "text-red-400 font-bold";
                                      else if (displayScore === holePar)
                                        color = "text-emerald-400";
                                      else if (displayScore === holePar + 1)
                                        color = "text-sky-400";
                                      else if (displayScore >= holePar + 2)
                                        color = "text-sky-600";

                                      return (
                                        <td
                                          key={i}
                                          className={`px-1.5 py-1 text-center ${color}`}
                                        >
                                          {displayScore}
                                          {strokes > 0 && (
                                            <span className="text-amber-400 text-xs ml-0.5">
                                              &#8226;
                                            </span>
                                          )}
                                        </td>
                                      );
                                    })}
                                    <td className="px-2 py-1 text-center text-white font-bold">
                                      {score}
                                    </td>
                                    <td
                                      className={`px-2 py-1 text-center font-medium ${
                                        diff > 0
                                          ? "text-sky-400"
                                          : diff < 0
                                            ? "text-red-400"
                                            : "text-emerald-400"
                                      }`}
                                    >
                                      {played > 0
                                        ? diff > 0
                                          ? `+${diff}`
                                          : diff === 0
                                            ? "E"
                                            : diff
                                        : "-"}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                      {/* Course info */}
                      {courseData && (
                        <p className="text-slate-500 text-xs text-center mt-3">
                          Rating {courseData.rating} &middot; Slope {courseData.slope}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-center gap-3 mt-4">
                        <button
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-500 transition-colors"
                          onClick={() => onLoadRound(round)}
                        >
                          Continue Round
                        </button>
                        {confirmDelete === realIndex ? (
                          <div className="flex gap-2">
                            <button
                              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-500 transition-colors"
                              onClick={() => deleteRound(realIndex)}
                            >
                              Confirm
                            </button>
                            <button
                              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-600 transition-colors"
                              onClick={() => setConfirmDelete(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="px-4 py-2 bg-slate-700 text-rose-400 rounded-xl text-sm font-medium hover:bg-slate-600 transition-colors"
                            onClick={() => setConfirmDelete(realIndex)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoundHistory;
