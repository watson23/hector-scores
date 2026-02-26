export interface CourseData {
  par: number[];
  handicapIndex: number[];
  rating: number;
  slope: number;
}

export function calculateCourseHandicap(playerHandicap: number, courseData: CourseData): number {
  return Math.round(playerHandicap * (courseData.slope / 113));
}

export function getStrokesOnHole(
  playerHandicap: number,
  courseData: CourseData,
  holeNumber: number
): number {
  const courseHandicap = calculateCourseHandicap(playerHandicap, courseData);
  const holeHandicapIndex = courseData.handicapIndex[holeNumber - 1];

  if (courseHandicap >= holeHandicapIndex) {
    return Math.floor(courseHandicap / 18) + (courseHandicap % 18 >= holeHandicapIndex ? 1 : 0);
  }
  return 0;
}
