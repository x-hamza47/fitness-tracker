import { api } from "@/lib/api";
import type {
    ExerciseProgress,
    ExerciseProgressRange,
    LogWorkoutPayload,
    WorkoutLog,
    WorkoutLogFilters,
    WorkoutLogPage,
} from "@/types/workoutLog";

export async function logWorkout(payload: LogWorkoutPayload): Promise<WorkoutLog> {
    const { data } = await api.post("/workout-logs", payload);
    return data.data;
}

export async function getWorkoutLogs(filters: WorkoutLogFilters): Promise<WorkoutLogPage> {
    const { search, category, from, to, page } = filters;
    const { data } = await api.get("/workout-logs", {
        params: {
            search: search || undefined,
            category: category === "all" ? undefined : category,
            from: from || undefined,
            to: to || undefined,
            page,
        },
    });
    return data.data;
}

export async function deleteWorkoutLog(id: string): Promise<void> {
    await api.delete(`/workout-logs/${id}`);
}

export async function getExerciseNames(): Promise<string[]> {
    const { data } = await api.get("/workout-logs/exercises");
    return data.data;
}

export async function getExerciseProgress(
    name: string,
    range: ExerciseProgressRange,
): Promise<ExerciseProgress> {
    const { data } = await api.get(
        `/workout-logs/exercises/${encodeURIComponent(name)}/progress`,
        { params: { range } },
    );
    return data.data;
}