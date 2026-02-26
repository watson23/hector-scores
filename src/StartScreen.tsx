import React, { useState } from "react";
import { Player, Scores } from "./types";
import { courseLabels } from "./data/courses";
import { getProfiles, saveProfile, deleteProfile, PlayerProfile } from "./playerProfiles";

interface StartScreenProps {
  course: string;
  setCourse: (course: string) => void;
  holeCount: number;
  setHoleCount: (count: number) => void;
  roundName: string;
  setRoundName: (name: string) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  scores: Scores;
  setScores: (scores: Scores) => void;
  holeCountOptions?: number[];
  onStart: () => void;
  onShowHistory?: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  course,
  setCourse,
  holeCount,
  setHoleCount,
  roundName,
  setRoundName,
  players,
  setPlayers,
  scores,
  setScores,
  holeCountOptions = [9, 18],
  onStart,
  onShowHistory,
}) => {
  // Player input state is local — only needed on this screen
  const [playerInput, setPlayerInput] = useState("");
  const [playerHandicap, setPlayerHandicap] = useState("");

  const [savedProfiles, setSavedProfiles] = useState<PlayerProfile[]>(getProfiles);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [editHandicap, setEditHandicap] = useState("");

  const addPlayer = () => {
    const name = playerInput.trim();
    const hcp = parseFloat(playerHandicap) || 0;

    if (name && !players.some((p) => p.name === name)) {
      const newPlayer: Player = { name, handicap: hcp };
      setPlayers([...players, newPlayer]);
      setScores({ ...scores, [name]: Array(holeCount).fill("") });
      // Auto-save to profiles
      saveProfile(newPlayer);
      setSavedProfiles(getProfiles());
      setPlayerInput("");
      setPlayerHandicap("");
    }
  };

  const addFromProfile = (profile: PlayerProfile) => {
    if (!players.some((p) => p.name === profile.name)) {
      setPlayers([...players, { name: profile.name, handicap: profile.handicap }]);
      setScores({ ...scores, [profile.name]: Array(holeCount).fill("") });
    }
  };

  const removePlayer = (playerName: string) => {
    setPlayers(players.filter((p) => p.name !== playerName));
    const newScores = { ...scores };
    delete newScores[playerName];
    setScores(newScores);
  };

  const removeProfile = (name: string) => {
    deleteProfile(name);
    setSavedProfiles(getProfiles());
  };

  const startEditProfile = (profile: PlayerProfile) => {
    setEditingProfile(profile.name);
    setEditHandicap(String(profile.handicap));
  };

  const saveEditProfile = (name: string) => {
    const hcp = parseFloat(editHandicap) || 0;
    saveProfile({ name, handicap: hcp });
    setSavedProfiles(getProfiles());
    // Also update if player is already in the round
    if (players.some((p) => p.name === name)) {
      setPlayers(players.map((p) => (p.name === name ? { ...p, handicap: hcp } : p)));
    }
    setEditingProfile(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/icons/icon-192x192.png" alt="Hector" className="w-20 h-20 mb-3" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Hector Scores</h1>
          <p className="text-sm text-emerald-400 font-medium">Golf Scorecard</p>
        </div>

        {/* Round Setup Card */}
        <div className="bg-slate-900 rounded-2xl p-4 mb-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
              Course
            </label>
            <select
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              {Object.entries(courseLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
              Holes
            </label>
            <select
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
              value={holeCount}
              onChange={(e) => setHoleCount(Number(e.target.value))}
            >
              {holeCountOptions.map((count) => (
                <option key={count} value={count}>
                  {count} holes
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
              Round name
            </label>
            <input
              type="text"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 w-full placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g. Friday with Ville & Laura"
            />
          </div>
        </div>

        {/* Saved Players — quick add */}
        {savedProfiles.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-4 mb-4">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
              Saved Players
            </label>
            <div className="space-y-2">
              {savedProfiles.map((profile) => {
                const isInRound = players.some((p) => p.name === profile.name);
                const isEditing = editingProfile === profile.name;

                return (
                  <div
                    key={profile.name}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                      isInRound ? "bg-emerald-900/30 border border-emerald-800" : "bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                          isInRound
                            ? "bg-emerald-800 text-emerald-300"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`font-medium ${
                            isInRound ? "text-emerald-300" : "text-white"
                          }`}
                        >
                          {profile.name}
                        </span>
                        {isEditing ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              step="0.1"
                              value={editHandicap}
                              onChange={(e) => setEditHandicap(e.target.value)}
                              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-2 py-1 w-20 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              autoFocus
                            />
                            <button
                              className="text-emerald-400 text-xs font-medium"
                              onClick={() => saveEditProfile(profile.name)}
                            >
                              Save
                            </button>
                            <button
                              className="text-slate-500 text-xs font-medium"
                              onClick={() => setEditingProfile(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span
                            className="text-slate-500 text-sm ml-2 cursor-pointer hover:text-slate-300 transition-colors"
                            onClick={() => startEditProfile(profile)}
                            title="Click to edit handicap"
                          >
                            HCP {profile.handicap}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {!isEditing && (
                        <>
                          {isInRound ? (
                            <span className="text-emerald-400 text-xs font-medium px-2 py-1">
                              Added
                            </span>
                          ) : (
                            <button
                              className="bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-500 transition-colors"
                              onClick={() => addFromProfile(profile)}
                            >
                              Add
                            </button>
                          )}
                          {!isInRound && (
                            <button
                              className="text-slate-600 hover:text-rose-400 text-xs transition-colors"
                              onClick={() => removeProfile(profile.name)}
                              title="Delete profile"
                            >
                              &#10005;
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add New Player Card */}
        <div className="bg-slate-900 rounded-2xl p-4 mb-4">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
            {savedProfiles.length > 0 ? "Add New Player" : "Add Players"}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 w-full placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Player name"
            />
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={playerHandicap}
                onChange={(e) => setPlayerHandicap(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 flex-1 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Handicap (e.g. 15.2)"
              />
              <button
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-500 transition-colors"
                onClick={addPlayer}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Current Round Players */}
        {players.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-4 mb-4">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
              Round Players ({players.length})
            </label>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.name}
                  className="flex justify-between items-center bg-slate-800 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-white font-medium">{player.name}</span>
                      <span className="text-slate-400 text-sm ml-2">HCP {player.handicap}</span>
                    </div>
                  </div>
                  <button
                    className="text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors"
                    onClick={() => removePlayer(player.name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          {players.length > 0 && (
            <button
              className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/30"
              onClick={onStart}
            >
              Start Round
            </button>
          )}

          {onShowHistory && (
            <button
              className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-700 transition-colors"
              onClick={onShowHistory}
            >
              Round History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
