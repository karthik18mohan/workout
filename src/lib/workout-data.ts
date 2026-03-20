import { Exercise, GymDay, HomeWorkout } from "./types";

function e(name: string, sets: [number | string, number | string][], note?: string): Exercise {
  return {
    name,
    sets: sets.map(([weight, reps]) => ({ weight, reps })),
    note,
  };
}

// ─── PHASE 1 (Weeks 1-4) ─────────────────────────────────────────────
const phase1GymDays: GymDay[] = [
  {
    label: "CHEST & TRICEPS",
    dayNumber: 1,
    exercises: [
      e("Push-ups", [["BW", 20], ["BW", 15], ["BW", 15]]),
      e("Butterfly Pec Deck", [[100, 10], [110, 10], [120, 8]]),
      e("Incline DB Press", [[70, 10], [90, 5], [90, 5]]),
      e("Tricep Pushdown Bar", [[100, 10], [120, 10], [130, 8]]),
      e("Tricep Rope Pushdown", [[60, 10], [70, 10], [70, 8]]),
      e("Cable Crunch", [[110, 30], [125, 25], [140, 15]]),
      e("Hanging Knee Raise", [["BW", 12], ["BW", 12], ["BW", 10]]),
    ],
  },
  {
    label: "BACK & BICEPS",
    dayNumber: 2,
    exercises: [
      e("Push-ups", [["BW", 20], ["BW", 15], ["BW", 15]]),
      e("Assisted Pull-up", [[-35.5, 8], [-35.5, 8], [-52, 9]]),
      e("Lat Pulldown Cable", [[105, 10], [120, 10], [130, 8]]),
      e("Seated Row Machine", [[100, 10], [130, 10], [140, 7]], "SS"),
      e("EZ Bar Curl", [[44, 10], [55, 8], [44, 10]], "SS"),
      e("Rear Delt Fly Machine", [[65, 10], [80, 10], [90, 6]]),
      e("Hammer Curl Cable", [[60, 10], [65, 10], [80, 7]]),
      e("Cable Crunch", [[110, 30], [125, 20], [140, 15]]),
      e("Wrist Curl", [[22, 20], [33, 20]]),
    ],
  },
  {
    label: "LEGS",
    dayNumber: 3,
    exercises: [
      e("DB Lunge", [[44, 20], [60, 20], [50, 20]]),
      e("Smith Squat", [[64, 10], [86, 9], [108, 6]]),
      e("Leg Press", [[286, 10], [360, 10], [360, 8]]),
      e("Leg Extension", [[110, 10], [120, 10], [135, 10]]),
      e("Cable Crunch", [[110, 30], [125, 25]]),
      e("Side Plank", [["BW", "30sec"], ["BW", "30sec"], ["BW", "30sec"]]),
    ],
  },
  {
    label: "SHOULDERS & ARMS",
    dayNumber: 4,
    exercises: [
      e("DB OH Press", [[35, 10], [40, 10], [40, 8]]),
      e("DB Lat Raise", [[15, 15], [20, 15], [20, 12], [15, 15]]),
      e("Face Pulls", [[30, 15], [35, 15], [40, 12]]),
      e("EZ Curl", [[44, 10], [55, 8], [44, 10]]),
      e("Tricep Pushdown", [[100, 10], [120, 10], [130, 8]]),
      e("Hammer Curl", [[60, 10], [65, 10], [80, 7]]),
      e("Cable Crunch", [[110, 30], [125, 25], [140, 15]]),
      e("Plank", [["BW", "45sec"], ["BW", "45sec"], ["BW", "45sec"]]),
    ],
  },
];

// ─── PHASE 2 (Weeks 5-8) ~10% heavier, supersets ─────────────────────
function scaleExercise(ex: Exercise, factor: number): Exercise {
  return {
    ...ex,
    sets: ex.sets.map((s) => ({
      weight: typeof s.weight === "number" ? Math.round(s.weight * factor) : s.weight,
      reps: s.reps,
    })),
  };
}

function scaleGymDay(day: GymDay, factor: number, notePrefix?: string): GymDay {
  return {
    ...day,
    exercises: day.exercises.map((ex) => {
      const scaled = scaleExercise(ex, factor);
      if (notePrefix && !scaled.note) scaled.note = "SS";
      return scaled;
    }),
  };
}

const phase2GymDays: GymDay[] = phase1GymDays.map((d) => scaleGymDay(d, 1.1));

// ─── PHASE 3 (Weeks 9-12) another ~10%, drop sets ────────────────────
const phase3GymDays: GymDay[] = phase1GymDays.map((d) => {
  const scaled = scaleGymDay(d, 1.2);
  return {
    ...scaled,
    exercises: scaled.exercises.map((ex) => ({
      ...ex,
      note: ex.note ? ex.note + " + Drop Set" : "Drop Set / AMRAP",
    })),
  };
});

export const gymDaysByPhase: Record<number, GymDay[]> = {
  1: phase1GymDays,
  2: phase2GymDays,
  3: phase3GymDays,
};

// ─── HOME WORKOUTS ──────────────────────────────────────────────────
export const homeWorkouts: HomeWorkout[] = [
  {
    id: "A",
    label: "Home A - CORE",
    exercises: [
      e("Push-ups", [["BW", 20], ["BW", 15], ["BW", 15]]),
      e("DB Russian Twist", [["BW", 20], ["BW", 20], ["BW", 20]]),
      e("Bicycle Crunch", [["BW", 20], ["BW", 20], ["BW", 20]]),
      e("Leg Raises", [["BW", 15], ["BW", 15], ["BW", 15]]),
      e("Dead Bug", [["BW", "10/side"], ["BW", "10/side"], ["BW", "10/side"]]),
      e("Plank", [["BW", "45sec"], ["BW", "45sec"], ["BW", "45sec"]]),
      e("Mountain Climbers", [["BW", "30sec"], ["BW", "30sec"], ["BW", "30sec"]]),
    ],
  },
  {
    id: "B",
    label: "Home B - UPPER",
    exercises: [
      e("Incline Push-ups", [["BW", 15], ["BW", 15], ["BW", 15]]),
      e("DB Floor Press", [["DB", 15], ["DB", 15], ["DB", 15]]),
      e("DB Curl to Press", [["DB", 12], ["DB", 12], ["DB", 12]]),
      e("Diamond Push-ups", [["BW", 12], ["BW", 12], ["BW", 12]]),
      e("DB Lat Raise", [["DB", 15], ["DB", 15], ["DB", 15]]),
      e("Plank Shoulder Taps", [["BW", 20], ["BW", 20], ["BW", 20]]),
      e("Reverse Crunch", [["BW", 15], ["BW", 15], ["BW", 15]]),
    ],
  },
  {
    id: "C",
    label: "Home C - LOWER",
    exercises: [
      e("DB Goblet Squat", [["DB", 15], ["DB", 15], ["DB", 15]]),
      e("DB Lunge", [["DB", "12/leg"], ["DB", "12/leg"], ["DB", "12/leg"]]),
      e("DB RDL", [["DB", 12], ["DB", 12], ["DB", 12]]),
      e("Glute Bridge", [["BW", 15], ["BW", 15], ["BW", 15]]),
      e("Side Plank Dips", [["BW", "12/side"], ["BW", "12/side"], ["BW", "12/side"]]),
      e("Flutter Kicks", [["BW", "30sec"], ["BW", "30sec"], ["BW", "30sec"]]),
      e("Woodchoppers", [["DB", "12/side"], ["DB", "12/side"], ["DB", "12/side"]]),
    ],
  },
  {
    id: "D",
    label: "Home D - HIIT",
    exercises: [
      e("Burpees", [["BW", 10], ["BW", 10], ["BW", 10], ["BW", 10]]),
      e("Jump Squats", [["BW", 15], ["BW", 15], ["BW", 15], ["BW", 15]]),
      e("High Knees", [["BW", "30sec"], ["BW", "30sec"], ["BW", "30sec"], ["BW", "30sec"]]),
      e("DB Thrusters", [["DB", 12], ["DB", 12], ["DB", 12]]),
      e("V-Ups", [["BW", 12], ["BW", 12], ["BW", 12]]),
      e("Plank to Push-up", [["BW", 10], ["BW", 10], ["BW", 10]]),
      e("Bicycle Crunch", [["BW", 20], ["BW", 20], ["BW", 20]]),
    ],
  },
];
