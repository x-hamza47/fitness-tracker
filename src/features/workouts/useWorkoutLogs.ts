import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { overviewKeys } from "@/features/dashboard/useOverview";
import { workoutKeys } from "@/features/workouts/useWorkouts";
import { getAuthErrorMessage } from "@/services/authService";
import { notificationKeys } from "@/features/social/useNotifications";
import {
    deleteWorkoutLog,
    getExerciseNames,
    getExerciseProgress,
    getWorkoutLogs,
    logWorkout,
} from "@/services/workoutLogService";
import { useIsAuthenticated } from "@/stores/authStore";
import type {
    ExerciseProgress,
    ExerciseProgressRange,
    WorkoutLogFilters,
    WorkoutLogPage,
} from "@/types/workoutLog";

export const workoutLogKeys = {
    all: ["workout-logs"] as const,
    list: (filters: WorkoutLogFilters) => [...workoutLogKeys.all, "list", filters] as const,
    exercises: () => [...workoutLogKeys.all, "exercises"] as const,
    progress: (name: string, range: ExerciseProgressRange) =>
        [...workoutLogKeys.all, "progress", name, range] as const,
};

export function useWorkoutLogs(filters: WorkoutLogFilters) {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<WorkoutLogPage>({
        queryKey: workoutLogKeys.list(filters),
        queryFn: () => getWorkoutLogs(filters),
        enabled: isAuthenticated,
        placeholderData: keepPreviousData,
    });

    return {
        page: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}

export function useExerciseNames() {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<string[]>({
        queryKey: workoutLogKeys.exercises(),
        queryFn: getExerciseNames,
        enabled: isAuthenticated,
    });

    return { names: query.data ?? [], isLoading: query.isLoading };
}

export function useExerciseProgress(name: string | null, range: ExerciseProgressRange) {
    const query = useQuery<ExerciseProgress>({
        queryKey: workoutLogKeys.progress(name ?? "", range),
        queryFn: () => getExerciseProgress(name as string, range),
        enabled: !!name,
        placeholderData: keepPreviousData,
    });

    return {
        progress: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}

function useRefreshLogData() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: workoutLogKeys.all });
        queryClient.invalidateQueries({ queryKey: workoutKeys.all });
        queryClient.invalidateQueries({ queryKey: overviewKeys.all });
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    };
}

export function useLogWorkout() {
    const refresh = useRefreshLogData();

    const mutation = useMutation({
        mutationFn: logWorkout,
        onSuccess: refresh,
    });

    return {
        logAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useDeleteWorkoutLog() {
    const refresh = useRefreshLogData();

    const mutation = useMutation({
        mutationFn: deleteWorkoutLog,
        onSuccess: refresh,
    });

    return {
        remove: mutation.mutate,
        removeAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
    };
}