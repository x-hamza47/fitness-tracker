import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { overviewKeys } from "@/features/dashboard/useOverview";
import { getAuthErrorMessage } from "@/services/authService";
import {
    createBodyEntry,
    createPerformance,
    deleteBodyEntry,
    deletePerformance,
    getProgress,
    updateBodyEntry,
    updatePerformance,
} from "@/services/userService";
import { useIsAuthenticated } from "@/stores/authStore";
import type {
    ProgressData,
    ProgressRange,
    UpdateBodyEntryPayload,
    UpdatePerformancePayload,
} from "@/types/progress";

export const progressKeys = {
    all: ["progress"] as const,
    range: (range: ProgressRange) => ["progress", "range", range] as const,
};

/** Check-ins and records for the selected range. */
export function useProgress(range: ProgressRange) {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<ProgressData>({
        queryKey: progressKeys.range(range),
        queryFn: () => getProgress(range),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        // Keep the old charts on screen while a new range loads
        placeholderData: keepPreviousData,
    });

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
}

/** Shared by every mutation: refresh Progress (all ranges) and the Overview numbers. */
function useRefreshProgressData() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: progressKeys.all });
        queryClient.invalidateQueries({ queryKey: overviewKeys.all });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["nutrition"] });
        queryClient.invalidateQueries({ queryKey: ["plan"] });
    };
}

/* ------------------------------ body check-ins ------------------------------ */

export function useCreateBodyEntry() {
    const refresh = useRefreshProgressData();
    const mutation = useMutation({ mutationFn: createBodyEntry, onSuccess: refresh });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useUpdateBodyEntry() {
    const refresh = useRefreshProgressData();
    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBodyEntryPayload }) =>
            updateBodyEntry(id, payload),
        onSuccess: refresh,
    });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useDeleteBodyEntry() {
    const refresh = useRefreshProgressData();
    const mutation = useMutation({ mutationFn: deleteBodyEntry, onSuccess: refresh });

    return {
        removeAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

/* ---------------------------- performance records ---------------------------- */

export function useCreatePerformance() {
    const refresh = useRefreshProgressData();
    const mutation = useMutation({ mutationFn: createPerformance, onSuccess: refresh });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useUpdatePerformance() {
    const refresh = useRefreshProgressData();
    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdatePerformancePayload }) =>
            updatePerformance(id, payload),
        onSuccess: refresh,
    });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useDeletePerformance() {
    const refresh = useRefreshProgressData();
    const mutation = useMutation({ mutationFn: deletePerformance, onSuccess: refresh });

    return {
        removeAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}