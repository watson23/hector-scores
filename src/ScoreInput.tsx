
import React from "react";

interface ScoreInputProps {
  player: string;
  value: string;
  onScoreChange: (value: string) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ player, value, onScoreChange }) => {
  return (
    <div className="bg-gray-50 border border-purple-300 shadow-sm rounded-3xl p-6 mb-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-purple-800">{player}</span>
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
