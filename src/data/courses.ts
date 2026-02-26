import { CourseData } from "../types";

/** All course data in one place */
export const courses: Record<string, CourseData> = {
  hirsala: {
    par: [4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 4, 5, 4, 3, 5, 3, 4, 5],
    handicapIndex: [5, 17, 7, 1, 11, 9, 3, 15, 13, 6, 14, 2, 10, 18, 4, 16, 12, 8],
    rating: 74.4,
    slope: 134,
  },
  tapiola: {
    par: [5, 3, 4, 3, 5, 4, 4, 4, 4, 4, 5, 4, 3, 4, 4, 4, 4, 4],
    handicapIndex: [1, 17, 9, 15, 3, 11, 7, 13, 5, 8, 2, 6, 18, 12, 14, 10, 16, 4],
    rating: 72.8,
    slope: 127,
  },
  vuosaari: {
    par: [4, 4, 3, 5, 4, 4, 4, 4, 5, 5, 4, 5, 3, 4, 3, 4, 3, 4],
    handicapIndex: [7, 11, 17, 1, 9, 13, 5, 15, 3, 2, 12, 4, 18, 8, 16, 6, 14, 10],
    rating: 74.4,
    slope: 136,
  },
  gumböle: {
    par: [5, 3, 4, 4, 3, 4, 3, 5, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3],
    handicapIndex: [1, 15, 11, 7, 17, 9, 13, 3, 5, 12, 8, 6, 18, 10, 16, 2, 4, 14],
    rating: 69.0,
    slope: 123,
  },
};

/** Dropdown labels for the course selector */
export const courseLabels: Record<string, string> = {
  hirsala: "Hirsala Golf (74.4/134)",
  tapiola: "Tapiola Golf (72.8/127)",
  vuosaari: "Vuosaari Golf (74.4/136)",
  gumböle: "Gumböle Golf (69.0/123)",
};

/** Format a course key for display, e.g. "hirsala" → "Hirsala Golf" */
export function courseDisplayName(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1) + " Golf";
}
