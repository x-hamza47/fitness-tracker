import type { WorkoutCategory } from "@/types/dashboard";


export type { WorkoutCategory };

export type Exercise = {
    id: string;
    name: string;
    sets: number;
    reps: number;
    
    weightKg: number | null;
    notes: string;
};

export type Workout = {
    id: string;
    name: string;
    category: WorkoutCategory;
    tags: string[];
    exercises: Exercise[];
    
    durationMin: number;
    notes: string;
    favorite: boolean;
    
    createdAt: string;
    
    updatedAt: string;
    
    lastPerformedAt: string | null;
};


export type CreateWorkoutPayload = {
    name: string;
    category: WorkoutCategory;
    tags: string[];
    exercises: Exercise[];
    durationMin: number;
    notes: string;
};

export type UpdateWorkoutPayload = Partial<CreateWorkoutPayload> & {
    favorite?: boolean;
};

export type WorkoutSort = "recent" | "name" | "exercises";

export type WorkoutFilters = {
    search: string;
    category: WorkoutCategory | "all";
    
    tag: string | null;
    sort: WorkoutSort;
};

export const DEFAULT_WORKOUT_FILTERS: WorkoutFilters = {
    search: "",
    category: "all",
    tag: null,
    sort: "recent",
};


export function getWorkoutVolumeKg(workout: Pick<Workout, "exercises">): number {
    return workout.exercises.reduce(
        (sum, e) => sum + e.sets * e.reps * (e.weightKg ?? 0),
        0,
    );
}