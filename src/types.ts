/** Shared types for Hector Scores */

export interface Player {
  name: string;
  handicap: number;
}

export interface CourseData {
  par: number[];
  handicapIndex: number[];
  rating: number;
  slope: number;
}

export type Scores = { [playerName: string]: string[] };

export interface SavedRound {
  name: string;
  date: string;
  holeCount: number;
  course: string;
  players: Player[];
  scores: Scores;
}
