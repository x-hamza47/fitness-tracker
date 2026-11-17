import type { WorkoutCategory } from "@/types/dashboard";

export type LogSet = {
    reps: number;
    weightKg: number | null;
};

export type LogExercise = {
    id: string;
    name: string;
    sets: LogSet[];
    notes: string;
};

export type WorkoutLog = {
    id: string;
    
    workout: string | null;
    name: string;
    category: WorkoutCategory;
    
    performedAt: string;
    durationMin: number;
    exercises: LogExercise[];
    notes: string;
    totalVolumeKg: number;
    totalSets: number;
    createdAt: string;
    updatedAt: string;
};

export type LogWorkoutPayload = {
    workoutId?: string;
    name?: string;
    category?: WorkoutCategory;
    performedAt?: string;
    durationMin?: number;
    exercises?: { name: string; sets: LogSet[]; notes: string }[];
    notes?: string;
};

export type WorkoutLogFilters = {
    search: string;
    category: WorkoutCategory | "all";
    from: string;
    to: string;
    page: number;
};

export const DEFAULT_LOG_FILTERS: WorkoutLogFilters = {
    search: "",
    category: "all",
    from: "",
    to: "",
    page: 1,
};

export type WorkoutLogPage = {
    items: WorkoutLog[];
    total: number;
    page: number;
    limit: number;
    pages: number;
};

export type ExerciseProgressRange = "7d" | "30d" | "90d";

export type ExerciseProgressPoint = {
    date: string;
    maxWeightKg: number;
    volumeKg: number;
    totalReps: number;
    estimated1RMKg: number;
};

export type ExerciseProgress = {
    exercise: string;
    points: ExerciseProgressPoint[];
    personalBest: { maxWeightKg: number; estimated1RMKg: number };
    sessions: number;
};