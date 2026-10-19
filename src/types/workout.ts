import type { WorkoutCategory } from "@/types/dashboard";

/** Re-exported so Workouts code imports everything from one place. */
export type { WorkoutCategory };

export type Exercise = {
    id: string;
    name: string;
    sets: number;
    reps: number;
    /** Always stored in kg, null for bodyweight or cardio. The UI converts for display. */
    weightKg: number | null;
    notes: string;
};

export type Workout = {
    id: string;
    name: string;
    category: WorkoutCategory;
    tags: string[];
    exercises: Exercise[];
    /** Planned duration in minutes */
    durationMin: number;
    notes: string;
    favorite: boolean;
    /** ISO date-time */
    createdAt: string;
    /** ISO date-time */
    updatedAt: string;
    /** ISO date-time, null if never performed */
    lastPerformedAt: string | null;
};

/** What the form sends when creating a routine. The server fills in the rest. */
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
    /** null means no tag filter */
    tag: string | null;
    sort: WorkoutSort;
};

export const DEFAULT_WORKOUT_FILTERS: WorkoutFilters = {
    search: "",
    category: "all",
    tag: null,
    sort: "recent",
};

/** Total volume of a routine in kg: sets x reps x weight, summed over exercises. */
export function getWorkoutVolumeKg(workout: Pick<Workout, "exercises">): number {
    return workout.exercises.reduce(
        (sum, e) => sum + e.sets * e.reps * (e.weightKg ?? 0),
        0,
    );
}