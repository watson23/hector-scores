import { CourseData } from "../types";

/** All course data in one place */
export const courses: Record<string, CourseData> = {
  hirsala: {
    par: [4, 3, 4, 5, 4, 4, 4, 3, 5, 4, 4, 5, 4, 3, 5, 3, 4, 5],
    handicapIndex: [2, 18, 12, 16, 10, 8, 6, 14, 4, 13, 5, 15, 3, 17, 9, 11, 1, 7],
    rating: 71.2,
    slope: 128,
  },
  tapiola: {
    par: [5, 3, 4, 3, 5, 4, 4, 4, 4, 4, 5, 4, 3, 4, 4, 4, 4, 4],
    handicapIndex: [14, 18, 12, 8, 6, 10, 4, 16, 2, 3, 17, 11, 9, 15, 1, 7, 13, 5],
    rating: 70.5,
    slope: 123,
  },
  vuosaari: {
    par: [4, 4, 3, 5, 4, 4, 4, 4, 5, 5, 4, 5, 3, 4, 3, 4, 3, 4],
    handicapIndex: [10, 14, 18, 16, 2, 12, 8, 4, 6, 9, 11, 1, 13, 5, 17, 7, 15, 3],
    rating: 72.0,
    slope: 131,
  },
  gumböle: {
    par: [5, 3, 4, 4, 3, 4, 3, 5, 5, 4, 4, 4, 3, 4, 3, 5, 4, 3],
    handicapIndex: [7, 15, 3, 5, 13, 11, 17, 9, 1, 8, 14, 10, 16, 4, 12, 6, 2, 18],
    rating: 69.0,
    slope: 123,
  },
  pickala_park: {
    par: [5, 4, 3, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4],
    handicapIndex: [14, 1, 16, 17, 3, 12, 15, 10, 6, 5, 18, 9, 4, 11, 13, 8, 2, 7],
    rating: 71.9,
    slope: 133,
  },
  pickala_forest: {
    par: [4, 4, 4, 3, 5, 4, 5, 4, 3, 5, 3, 4, 4, 5, 4, 3, 4, 4],
    handicapIndex: [6, 4, 11, 14, 1, 16, 7, 15, 17, 3, 18, 5, 12, 10, 2, 13, 9, 8],
    rating: 71.3,
    slope: 138,
  },
  pickala_seaside: {
    par: [4, 3, 5, 4, 4, 4, 5, 4, 3, 4, 4, 3, 5, 4, 5, 3, 4, 4],
    handicapIndex: [4, 12, 16, 1, 6, 5, 2, 8, 14, 13, 10, 15, 3, 7, 11, 17, 9, 18],
    rating: 71.0,
    slope: 128,
  },
};

/** Dropdown labels for the course selector */
export const courseLabels: Record<string, string> = {
  hirsala: "Hirsala Golf Yellow (71.2/128)",
  tapiola: "Tapiola Golf 57 (70.5/123)",
  vuosaari: "Vuosaari Golf 58 (72.0/131)",
  gumböle: "Gumböle Golf 52 (67.8/121)",
  pickala_park: "Pickala Park 60 (71.9/133)",
  pickala_forest: "Pickala Forest 59 (71.3/138)",
  pickala_seaside: "Pickala Seaside 57 (71.0/128)",
};

/** Format a course key for display, e.g. "hirsala" → "Hirsala Golf" */
export function courseDisplayName(key: string): string {
  // Handle underscore-separated names like "pickala_park" → "Pickala Park"
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
