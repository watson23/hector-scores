import React from "react";

interface Player {
  name: string;
  handicap: number;
}

interface StartScreenProps {
  course: string;
  setCourse: (course: string) => void;
  holeCount: number;
  setHoleCount: (count: number) => void;
  roundName: string;
  setRoundName: (name: string) => void;
  playerInput: string;
  setPlayerInput: (name: string) => void;
  playerHandicap: string;
  setPlayerHandicap: (handicap: string) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  scores: { [playerName: string]: string[] };
  setScores: (scores: { [playerName: string]: string[] }) => void;
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
  playerHandicap,
  setPlayerHandicap,
  players,
  setPlayers,
  scores,
  setScores,
  holeCountOptions = [9, 18],
  onStart
}) => {
  const addPlayer = () => {
    const name = playerInput.trim();
    const hcp = parseFloat(playerHandicap) || 0;
    
    if (name && !players.some(p => p.name === name)) {
      const newPlayer: Player = { name, handicap: hcp };
      setPlayers([...players, newPlayer]);
      setScores({ ...scores, [name]: Array(holeCount).fill("") });
      setPlayerInput("");
      setPlayerHandicap("");
    }
  };

  const removePlayer = (playerName: string) => {
    setPlayers(players.filter(p => p.name !== playerName));
    const newScores = { ...scores };
    delete newScores[playerName];
    setScores(newScores);
  };

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
            <option value="hirsala">Hirsala Golf (74.4/134)</option>
            <option value="tapiola">Tapiola Golf (72.8/127)</option>
            <option value="vuosaari">Vuosaari Golf (74.4/136)</option>
            <option value="gumböle">Gumböle Golf (69.0/123)</option>
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
        
        <div className="mb-4">
          <label className="block text-purple-200 font-medium mb-2">Add Players:</label>
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              className="border border-purple-400 rounded px-3 py-2 w-full"
              placeholder="Player name"
            />
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={playerHandicap}
                onChange={(e) => setPlayerHandicap(e.target.value)}
                className="border border-purple-400 rounded px-3 py-2 flex-1"
                placeholder="Handicap (e.g. 15.2)"
              />
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                onClick={addPlayer}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        {players.length > 0 && (
          <div className="mb-4">
            <h3 className="text-purple-200 font-medium mb-2">Players:</h3>
            <ul className="space-y-2">
              {players.map((player) => (
                <li key={player.name} className="flex justify-between items-center bg-gray-800 rounded px-3 py-2">
                  <div>
                    <span className="text-yellow-300 font-medium">{player.name}</span>
                    <span className="text-purple-300 text-sm ml-2">HCP: {player.handicap}</span>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-300 text-sm"
                    onClick={() => removePlayer(player.name)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
