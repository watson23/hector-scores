import React, { useState } from "react";

interface Player {
  name: string;
  handicap: number;
}

interface ScorecardProps {
  players: Player[];
  scores: { [playerName: string]: string[] };
  holeCount: number;
  course: string;
  courses: Record<string, {
    par: number[];
    handicapIndex: number[];
    rating: number;
    slope: number;
  }>;
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
  getStrokesOnHole
}) => {
  const [showNet, setShowNet] = useState(false);
  const courseData = courses[course];

  const getLeaderboard = () => {
    return players
      .map(player => ({
        ...player,
        gross: totalScore(player.name, false),
        net: totalScore(player.name, true),
        played: scores[player.name]?.slice(0, holeCount).filter(s => s && !isNaN(parseInt(s))).length || 0
      }))
      .filter(player => player.played > 0)
      .sort((a, b) => (showNet ? a.net : a.gross) - (showNet ? b.net : b.gross));
  };

  const leaderboard = getLeaderboard();

  return (
    <div className="space-y-6">
      {/* Score Display Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              !showNet 
                ? 'bg-purple-600 text-white' 
                : 'text-purple-300 hover:text-white'
            }`}
            onClick={() => setShowNet(false)}
          >
            Gross Scores
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              showNet 
                ? 'bg-purple-600 text-white' 
                : 'text-purple-300 hover:text-white'
            }`}
            onClick={() => setShowNet(true)}
          >
            Net Scores
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-purple-200 mb-3 text-center">
            {showNet ? 'Net' : 'Gross'} Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div 
                key={player.name} 
                className={`flex justify-between items-center p-3 rounded ${
                  index === 0 ? 'bg-yellow-900 border-yellow-600 border' : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${index === 0 ? 'text-yellow-300' : 'text-purple-300'}`}>
                    #{index + 1}
                  </span>
                  <span className="text-white font-medium">{player.name}</span>
                  <span className="text-sm text-gray-400">(HCP: {player.handicap})</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${index === 0 ? 'text-yellow-300' : 'text-white'}`}>
                    {showNet ? player.net : player.gross}
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.played} holes played
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Scorecard */}
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
                <td key={i} className="px-2 py-1 text-center">{courseData.par[i]}</td>
              ))}
              <td className="px-2 py-1 text-center">
                {courseData.par.slice(0, holeCount).reduce((sum, val) => sum + val, 0)}
              </td>
              <td className="px-2 py-1 text-center">–</td>
            </tr>
            <tr className="bg-gray-100 text-gray-600 text-xs">
              <td className="px-2 py-1 text-left">HCP</td>
              {Array.from({ length: Number(holeCount) }).map((_, i) => (
                <td key={i} className="px-2 py-1 text-center">{courseData.handicapIndex[i]}</td>
              ))}
              <td className="px-2 py-1 text-center">–</td>
              <td className="px-2 py-1 text-center">–</td>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const current = scores[player.name] || [];
              const paddedScores = [...current, ...Array(holeCount - current.length).fill("")];
              
              return (
                <tr key={player.name} className="border-t">
                  <td className="px-2 py-1 font-medium text-purple-800 whitespace-nowrap">
                    {player.name}
                    <div className="text-xs text-gray-500">HCP: {player.handicap}</div>
                  </td>
                  {Array.from({ length: Number(holeCount) }).map((_, i) => {
                    const grossScore = parseInt(paddedScores[i]);
                    const par = courseData.par[i];
                    const strokes = getStrokesOnHole(player.handicap, i + 1);
                    const netScore = !isNaN(grossScore) ? Math.max(1, grossScore - strokes) : NaN;
                    
                    let style = "";
                    const scoreToCompare = showNet ? netScore : grossScore;
                    
                    if (!isNaN(scoreToCompare)) {
                      if (scoreToCompare < par) style = "bg-red-100 text-red-800";
                      else if (scoreToCompare === par) style = "";
                      else if (scoreToCompare === par + 1) style = "bg-blue-100 text-blue-800";
                      else if (scoreToCompare >= par + 2) style = "bg-blue-200 text-blue-900";
                    }
                    
                    return (
                      <td key={i} className={`px-2 py-1 text-center ${style} relative`}>
                        <div>{showNet && !isNaN(netScore) ? netScore : paddedScores[i]}</div>
                        {strokes > 0 && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
                        )}
                        {!showNet && !isNaN(grossScore) && strokes > 0 && (
                          <div className="text-xs text-gray-500">({netScore})</div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-2 py-1 text-center font-bold">
                    {showNet ? totalScore(player.name, true) : totalScore(player.name, false)}
                  </td>
                  <td className="px-2 py-1 text-center font-bold">{
                    (() => {
                      const relevantScores = paddedScores.slice(0, holeCount);
                      const played = relevantScores.map((s) => parseInt(s)).filter(n => !isNaN(n));
                      if (played.length === 0) return "–";
                      
                      const parPlayed = courseData.par.slice(0, played.length).reduce((sum, val) => sum + val, 0);
                      let scorePlayed;
                      
                      if (showNet) {
                        scorePlayed = relevantScores.reduce((sum, scoreStr, index) => {
                          const score = parseInt(scoreStr);
                          if (isNaN(score)) return sum;
                          const strokes = getStrokesOnHole(player.handicap, index + 1);
                          return sum + Math.max(1, score - strokes);
                        }, 0);
                      } else {
                        scorePlayed = played.reduce((sum, val) => sum + val, 0);
                      }
                      
                      const diff = scorePlayed - parPlayed;
                      return diff > 0 ? `+${diff}` : diff;
                    })()
                  }</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Course Info */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>{course.charAt(0).toUpperCase() + course.slice(1)} Golf</p>
          <p>Rating: {courseData.rating} | Slope: {courseData.slope}</p>
          <p className="text-xs mt-1">
            Yellow dots indicate handicap strokes • Net scores shown in parentheses when viewing gross
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
