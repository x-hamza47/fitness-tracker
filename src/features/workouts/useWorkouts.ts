import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { overviewKeys } from "@/features/dashboard/useOverview";
import { getAuthErrorMessage } from "@/services/authService";
import {
    createWorkout,
    deleteWorkout,
    duplicateWorkout,
    getWorkouts,
    updateWorkout,
} from "@/services/userService";
import { useIsAuthenticated } from "@/stores/authStore";
import type { UpdateWorkoutPayload, Workout } from "@/types/workout";

export const workoutKeys = {
    all: ["workouts"] as const,
    list: () => [...workoutKeys.all, "list"] as const,
};

/** The user's whole routine library. Filtering and sorting happen on the page. */
export function useWorkouts() {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<Workout[]>({
        queryKey: workoutKeys.list(),
        queryFn: getWorkouts,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    return {
        workouts: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}

/** Shared by every mutation: refresh the list and the Overview numbers. */
function useRefreshWorkoutData() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: workoutKeys.all });
        queryClient.invalidateQueries({ queryKey: overviewKeys.all });
    };
}

export function useCreateWorkout() {
    const queryClient = useQueryClient();
    const refresh = useRefreshWorkoutData();

    const mutation = useMutation({
        mutationFn: createWorkout,
        onSuccess: (created) => {
            // Show the new routine instantly, then let the invalidation confirm it
            queryClient.setQueryData<Workout[]>(workoutKeys.list(), (old) => [
                created,
                ...(old ?? []),
            ]);
            refresh();
        },
    });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useUpdateWorkout() {
    const queryClient = useQueryClient();
    const refresh = useRefreshWorkoutData();

    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateWorkoutPayload }) =>
            updateWorkout(id, payload),
        onSuccess: (updated) => {
            queryClient.setQueryData<Workout[]>(workoutKeys.list(), (old) =>
                old?.map((w) => (w.id === updated.id ? updated : w)),
            );
            refresh();
        },
    });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

/**
 * Favorite toggle. Optimistic: the star flips immediately and rolls back
 * if the request fails, so it never feels slow.
 */
export function useToggleFavorite() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
            updateWorkout(id, { favorite }),
        onMutate: async ({ id, favorite }) => {
            await queryClient.cancelQueries({ queryKey: workoutKeys.list() });
            const previous = queryClient.getQueryData<Workout[]>(workoutKeys.list());

            queryClient.setQueryData<Workout[]>(workoutKeys.list(), (old) =>
                old?.map((w) => (w.id === id ? { ...w, favorite } : w)),
            );

            return { previous };
        },
        onError: (_error, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(workoutKeys.list(), context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: workoutKeys.list() });
        },
    });

    return { toggle: mutation.mutate };
}

export function useDuplicateWorkout() {
    const queryClient = useQueryClient();
    const refresh = useRefreshWorkoutData();

    const mutation = useMutation({
        mutationFn: duplicateWorkout,
        onSuccess: (copy) => {
            queryClient.setQueryData<Workout[]>(workoutKeys.list(), (old) => [
                copy,
                ...(old ?? []),
            ]);
            refresh();
        },
    });

    return {
        duplicate: mutation.mutate,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
    };
}

export function useDeleteWorkout() {
    const queryClient = useQueryClient();
    const refresh = useRefreshWorkoutData();

    const mutation = useMutation({
        mutationFn: deleteWorkout,
        onSuccess: (_data, id) => {
            queryClient.setQueryData<Workout[]>(workoutKeys.list(), (old) =>
                old?.filter((w) => w.id !== id),
            );
            refresh();
        },
    });

    return {
        remove: mutation.mutate,
        removeAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
    };
}