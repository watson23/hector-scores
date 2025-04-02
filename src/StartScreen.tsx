
import React from "react";

interface StartScreenProps {
  course: string;
  setCourse: (course: string) => void;
  holeCount: number;
  setHoleCount: (count: number) => void;
  roundName: string;
  setRoundName: (name: string) => void;
  playerInput: string;
  setPlayerInput: (name: string) => void;
  players: string[];
  setPlayers: (players: string[]) => void;
  scores: { [player: string]: string[] };
  setScores: (scores: { [player: string]: string[] }) => void;
  holeCountOptions?: number[];
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  course,
  setCourse,
  holeCount,
  setHoleCount,
  roundName,
  setRoundName,
  playerInput,
  setPlayerInput,
  players,
  setPlayers,
  scores,
  setScores,
  holeCountOptions = [9, 18],
  onStart
}) => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col items-center mb-6">
          <img src="/icons/icon-192x192.png" alt="Hector Icon" className="w-16 h-16 mb-2" />
          <h1 className="text-3xl font-bold text-purple-300 text-center">Hector Scores</h1>
        </div>
        <div className="mb-6 w-full max-w-md">
          <label className="block text-purple-200 font-medium mb-1">Select course:</label>
          <select
            className="border border-purple-400 rounded px-3 py-2 w-full mb-4"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="hirsala">Hirsala Golf</option>
            <option value="tapiola">Tapiola Golf</option>
            <option value="vuosaari">Vuosaari Golf</option>
            <option value="gumböle">Gumböle Golf</option>
          </select>
          <label className="block text-purple-200 font-medium mb-1">Select number of holes:</label>
          <select
            className="border border-yellow-500 rounded px-3 py-2 w-full"
            value={holeCount}
            onChange={(e) => setHoleCount(Number(e.target.value))}
          >
            {holeCountOptions.map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 w-full max-w-md">
          <label className="block text-purple-300 font-medium mb-1">Round name:</label>
          <input
            type="text"
            value={roundName}
            onChange={(e) => setRoundName(e.target.value)}
            className="border border-yellow-500 rounded px-3 py-2 w-full"
            placeholder="e.g. Friday with Ville & Laura"
          />
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            className="border border-purple-400 rounded-l px-3 py-2 w-full"
            placeholder="Add player"
          />
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-r hover:bg-purple-700"
            onClick={() => {
              if (playerInput.trim() && !players.includes(playerInput.trim())) {
                const newPlayer = playerInput.trim();
                setPlayers([...players, newPlayer]);
                setScores({ ...scores, [newPlayer]: Array(holeCount).fill("") });
                setPlayerInput("");
              }
            }}
          >
            Add
          </button>
        </div>
        {players.length > 0 && (
          <ul className="mb-4">
            {players.map((p) => (
              <li key={p} className="text-yellow-800 text-sm">{p}</li>
            ))}
          </ul>
        )}
        {players.length > 0 && (
          <button
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 shadow-md w-full"
            onClick={onStart}
          >
            Start Round
          </button>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
