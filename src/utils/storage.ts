import { SavedRound } from "../types";

const HISTORY_KEY = "hector-history";

/** Read all saved rounds from localStorage */
export function getRounds(): SavedRound[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Append a new round to history */
export function saveRound(round: SavedRound): void {
  const rounds = getRounds();
  rounds.push(round);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(rounds));
}

/** Delete a round by index and return the updated list */
export function deleteRound(index: number): SavedRound[] {
  const rounds = getRounds().filter((_, i) => i !== index);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(rounds));
  return rounds;
}
