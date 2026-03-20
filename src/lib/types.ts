export interface ExerciseSet {
  weight: number | string; // number or "BW"
  reps: number | string; // number or duration string like "30sec"
}

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
  note?: string; // e.g., "SS" for superset, "Drop Set"
}

export interface GymDay {
  label: string;
  dayNumber: number;
  exercises: Exercise[];
}

export interface HomeWorkout {
  id: string;
  label: string;
  exercises: Exercise[];
}

export type WorkoutType = "gym" | "home" | "both" | "rest";

export interface DayLog {
  date: string; // YYYY-MM-DD
  workoutType: WorkoutType;
  gymDayNumber?: number; // 1-4 (which gym day they did)
  homeWorkoutId?: string; // "A" | "B" | "C" | "D"
  exerciseLogs?: Record<string, ExerciseSet[]>; // exercise name -> actual logged sets
  dailyChecklist: {
    steps: boolean;
    protein: boolean;
    water: boolean;
    sleep: boolean;
  };
}

export type Phase = 1 | 2 | 3;
