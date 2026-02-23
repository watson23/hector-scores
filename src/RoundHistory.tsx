import React, { useState } from "react";

interface Player {
  name: string;
  handicap: number;
}

interface SavedRound {
  name: string;
  date: string;
  holeCount: number;
  course: string;
  players: Player[];
  scores: { [playerName: string]: string[] };
}

interface RoundHistoryProps {
  onBack: () => void;
  onLoadRound: (round: SavedRound) => void;
  courses: Record<string, {
    par: number[];
    handicapIndex: number[];
    rating: number;
    slope: number;
  }>;
}

const RoundHistory: React.FC<RoundHistoryProps> = ({ onBack, onLoadRound, courses }) => {
  const [rounds, setRounds] = useState<SavedRound[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("hector-history") || "[]");
    } catch {
      return [];
    }
  });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showNet, setShowNet] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const courseName = (key: string) => key.charAt(0).toUpperCase() + key.slice(1) + " Golf";

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
    const courseHandicap = Math.round(playerHandicap * (courseData.slope / 113));
    const holeHandicapIndex = courseData.handicapIndex[holeNumber - 1];
    if (courseHandicap >= holeHandicapIndex) {
      return Math.floor(courseHandicap / 18) + (courseHandicap % 18 >= holeHandicapIndex ? 1 : 0);
    }
    return 0;
  };

  const playerNet = (round: SavedRound, player: Player) => {
    const s = round.scores[player.name] || [];
    return s.slice(0, round.holeCount).reduce((sum, val, index) => {
      const n = parseInt(val);
      if (isNaN(n)) return sum;
      const strokes = getStrokesOnHole(player.handicap, round.course, index + 1);
      return sum + Math.max(1, n - strokes);
    }, 0);
  };

  const holesPlayed = (round: SavedRound, playerName: string) => {
    const s = round.scores[playerName] || [];
    return s.slice(0, round.holeCount).filter(v => v && !isNaN(parseInt(v))).length;
  };

  const deleteRound = (index: number) => {
    const updated = rounds.filter((_, i) => i !== index);
    setRounds(updated);
    localStorage.setItem("hector-history", JSON.stringify(updated));
    setConfirmDelete(null);
    setExpandedIndex(null);
  };

  const getWinner = (round: SavedRound, useNet: boolean) => {
    let best = { name: "", score: Infinity };
    round.players.forEach(player => {
      const played = holesPlayed(round, player.name);
      if (played === 0) return;
      const score = useNet ? playerNet(round, player) : playerGross(round, player.name);
      if (score < best.score) {
        best = { name: player.name, score };
      }
    });
    return best.name;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600"
            onClick={onBack}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-purple-300">Round History</h1>
          <div className="w-20"></div>
        </div>

        {rounds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg mb-2">No saved rounds yet</p>
            <p className="text-gray-500">Play a round and save it to see it here!</p>
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
                <div key={realIndex} className="bg-gray-800 rounded-lg overflow-hidden">
                  {/* Summary row */}
                  <button
                    className="w-full text-left p-4 hover:bg-gray-750 transition-colors"
                    onClick={() => setExpandedIndex(isExpanded ? null : realIndex)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-purple-200 font-semibold text-lg">{round.name || "Unnamed Round"}</h3>
                        <p className="text-gray-400 text-sm">{round.date} • {courseName(round.course)}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {round.holeCount} holes • {round.players.length} player{round.players.length !== 1 ? "s" : ""}
                          {winner && <span className="text-yellow-400 ml-2">🏆 {winner}</span>}
                        </p>
                      </div>
                      <span className="text-purple-400 text-xl">{isExpanded ? "▾" : "▸"}</span>
                    </div>

                    {/* Quick scores preview */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {round.players.map(player => {
                        const gross = playerGross(round, player.name);
                        const played = holesPlayed(round, player.name);
                        const diff = gross - (courseData ? courseData.par.slice(0, played).reduce((s, v) => s + v, 0) : 0);
                        return (
                          <span key={player.name} className="text-sm">
                            <span className="text-gray-300">{player.name}</span>
                            <span className="text-white font-medium ml-1">{gross}</span>
                            {played > 0 && (
                              <span className={`ml-1 ${diff > 0 ? "text-blue-400" : diff < 0 ? "text-red-400" : "text-green-400"}`}>
                                ({diff > 0 ? "+" : ""}{diff})
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-gray-700 p-4">
                      {/* Net/Gross toggle */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-900 rounded-lg p-1 flex">
                          <button
                            className={`px-3 py-1 rounded text-sm transition-colors ${!showNet ? "bg-purple-600 text-white" : "text-purple-300"}`}
                            onClick={() => setShowNet(false)}
                          >
                            Gross
                          </button>
                          <button
                            className={`px-3 py-1 rounded text-sm transition-colors ${showNet ? "bg-purple-600 text-white" : "text-purple-300"}`}
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
                            <tr className="bg-purple-900 text-purple-200">
                              <th className="px-2 py-1 text-left">Hole</th>
                              {Array.from({ length: round.holeCount }).map((_, i) => (
                                <th key={i} className="px-1.5 py-1 text-center">{i + 1}</th>
                              ))}
                              <th className="px-2 py-1 text-center font-bold">Tot</th>
                              <th className="px-2 py-1 text-center">±</th>
                            </tr>
                            {courseData && (
                              <tr className="bg-gray-700 text-gray-300">
                                <td className="px-2 py-1 text-left">Par</td>
                                {Array.from({ length: round.holeCount }).map((_, i) => (
                                  <td key={i} className="px-1.5 py-1 text-center">{courseData.par[i]}</td>
                                ))}
                                <td className="px-2 py-1 text-center font-bold">{par}</td>
                                <td className="px-2 py-1 text-center">–</td>
                              </tr>
                            )}
                          </thead>
                          <tbody>
                            {round.players
                              .map(player => ({
                                player,
                                score: showNet ? playerNet(round, player) : playerGross(round, player.name),
                                played: holesPlayed(round, player.name),
                              }))
                              .sort((a, b) => a.score - b.score)
                              .map(({ player, score, played }) => {
                                const s = round.scores[player.name] || [];
                                const parPlayed = courseData
                                  ? courseData.par.slice(0, played).reduce((sum, v) => sum + v, 0)
                                  : 0;
                                const diff = score - parPlayed;

                                return (
                                  <tr key={player.name} className="border-t border-gray-700">
                                    <td className="px-2 py-1 text-purple-200 font-medium whitespace-nowrap">
                                      {player.name}
                                      <span className="text-gray-500 text-xs ml-1">({player.handicap})</span>
                                    </td>
                                    {Array.from({ length: round.holeCount }).map((_, i) => {
                                      const gross = parseInt(s[i]);
                                      if (isNaN(gross)) return <td key={i} className="px-1.5 py-1 text-center text-gray-600">–</td>;

                                      const strokes = getStrokesOnHole(player.handicap, round.course, i + 1);
                                      const net = Math.max(1, gross - strokes);
                                      const displayScore = showNet ? net : gross;
                                      const holePar = courseData?.par[i] || 0;

                                      let color = "text-gray-200";
                                      if (displayScore < holePar) color = "text-red-400 font-bold";
                                      else if (displayScore === holePar) color = "text-green-400";
                                      else if (displayScore === holePar + 1) color = "text-blue-300";
                                      else if (displayScore >= holePar + 2) color = "text-blue-500";

                                      return (
                                        <td key={i} className={`px-1.5 py-1 text-center ${color}`}>
                                          {displayScore}
                                          {strokes > 0 && <span className="text-yellow-500 text-xs">•</span>}
                                        </td>
                                      );
                                    })}
                                    <td className="px-2 py-1 text-center text-white font-bold">{score}</td>
                                    <td className={`px-2 py-1 text-center font-medium ${diff > 0 ? "text-blue-400" : diff < 0 ? "text-red-400" : "text-green-400"}`}>
                                      {played > 0 ? (diff > 0 ? `+${diff}` : diff) : "–"}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                      {/* Course info */}
                      {courseData && (
                        <p className="text-gray-500 text-xs text-center mt-3">
                          Rating: {courseData.rating} | Slope: {courseData.slope}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-center gap-3 mt-4">
                        <button
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                          onClick={() => onLoadRound(round)}
                        >
                          Continue Round
                        </button>
                        {confirmDelete === realIndex ? (
                          <div className="flex gap-2">
                            <button
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                              onClick={() => deleteRound(realIndex)}
                            >
                              Confirm Delete
                            </button>
                            <button
                              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 text-sm"
                              onClick={() => setConfirmDelete(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="px-4 py-2 bg-gray-700 text-red-300 rounded hover:bg-gray-600 text-sm"
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
