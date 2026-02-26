import { Player, Scores, CourseData } from "../types";
import { getStrokesOnHole } from "../handicap";

/** Single source of truth for net score calculation */
export function calculateNetScore(gross: number, strokes: number): number {
  return Math.max(1, gross - strokes);
}

/** Total score for a player (gross or net) */
export function calculateTotalScore(
  playerName: string,
  scores: Scores,
  holeCount: number,
  players: Player[],
  courseData: CourseData,
  useNet: boolean = false,
): number {
  const relevantScores = scores[playerName]?.slice(0, holeCount) || [];
  const player = players.find((p) => p.name === playerName);

  return relevantScores.reduce((sum, val, index) => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) return sum;

    if (useNet && player) {
      const strokes = getStrokesOnHole(player.handicap, courseData, index + 1);
      return sum + calculateNetScore(parsed, strokes);
    }
    return sum + parsed;
  }, 0);
}

/** Count holes with a recorded score */
export function holesPlayed(
  scores: Scores,
  playerName: string,
  holeCount: number,
): number {
  const s = scores[playerName] || [];
  return s.slice(0, holeCount).filter((v) => v && !isNaN(parseInt(v))).length;
}
