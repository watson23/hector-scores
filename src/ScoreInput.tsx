import React from "react";
import { calculateNetScore } from "./utils/scoring";

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
  onScoreChange,
}) => {
  const grossScore = parseInt(value) || 0;
  const netScore = grossScore > 0 ? calculateNetScore(grossScore, strokesOnHole) : 0;

  return (
    <div className="bg-slate-800 rounded-2xl p-4 mb-3">
      {/* Player info row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-semibold text-sm">
            {player.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-white font-semibold">{player}</span>
            <span className="text-slate-500 text-xs ml-2">HCP {playerHandicap}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {strokesOnHole > 0 && (
            <span className="text-xs bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
              +{strokesOnHole} stroke{strokesOnHole > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Score buttons — 3x3 grid + clear + text input */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {["1","2","3","4","5","6","7","8","9"].map((n) => (
          <button
            key={n}
            className={`h-12 rounded-xl font-semibold text-lg transition-colors ${
              value === n
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 text-white hover:bg-slate-600"
            }`}
            onClick={() => onScoreChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          className="h-12 rounded-xl font-medium text-slate-400 bg-slate-900 border border-slate-700 hover:bg-slate-700 transition-colors"
          onClick={() => onScoreChange("")}
        >
          CLR
        </button>
      </div>

      {/* Bottom row: text input for 10+ and score display */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="10+"
          className="bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 w-16 text-center text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          value={parseInt(value) >= 10 ? value : ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || (/^\d+$/.test(v) && parseInt(v) <= 15)) {
              onScoreChange(v);
            }
          }}
        />
        {grossScore > 0 && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">Gross: <span className="text-white font-semibold">{grossScore}</span></span>
            <span className="text-slate-400">Net: <span className="text-emerald-400 font-semibold">{netScore}</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreInput;
