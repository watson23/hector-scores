import React from "react";

interface ScoreInputProps {
  player: string;
  playerHandicap: number;
  strokesOnHole: number;
  value: string;
  onScoreChange: (value: string) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ 
  player, 
  playerHandicap, 
  strokesOnHole, 
  value, 
  onScoreChange 
}) => {
  const grossScore = parseInt(value) || 0;
  const netScore = grossScore > 0 ? Math.max(1, grossScore - strokesOnHole) : 0;

  return (
    <div className="bg-gray-50 border border-purple-300 shadow-sm rounded-3xl p-6 mb-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <span className="font-medium text-purple-800">{player}</span>
          <div className="text-sm text-gray-600">
            <span>HCP: {playerHandicap}</span>
            {strokesOnHole > 0 && (
              <span className="ml-3 text-blue-600 font-medium">
                +{strokesOnHole} stroke{strokesOnHole > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {grossScore > 0 && (
            <div className="text-sm text-gray-700 mt-1">
              <span>Gross: {grossScore}</span>
              <span className="ml-3 font-medium text-green-600">Net: {netScore}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {["1","2","3","4","5","6","7","8","9","-"].map((n) => (
            <button
              key={n}
              className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => onScoreChange(n === "-" ? "" : n)}
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
            value={value}
            onChange={(e) => onScoreChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreInput;
