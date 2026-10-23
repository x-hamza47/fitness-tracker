import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { overviewKeys } from "@/features/dashboard/useOverview";
import { getAuthErrorMessage } from "@/services/authService";
import {
    createMeal,
    deleteMeal,
    getNutritionAnalytics,
    getNutritionDay,
    updateMeal,
} from "@/services/userService";
import { useIsAuthenticated } from "@/stores/authStore";
import type {
    NutritionAnalytics,
    NutritionDay,
    NutritionRange,
    UpdateMealPayload,
} from "@/types/nutrition";

export const nutritionKeys = {
    all: ["nutrition"] as const,
    day: (date: string) => ["nutrition", "day", date] as const,
    analytics: (range: NutritionRange) => ["nutrition", "analytics", range] as const,
};

export function useNutritionDay(date: string) {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<NutritionDay>({
        queryKey: nutritionKeys.day(date),
        queryFn: () => getNutritionDay(date),
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
    });

    return {
        day: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}

export function useNutritionAnalytics(range: NutritionRange) {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<NutritionAnalytics>({
        queryKey: nutritionKeys.analytics(range),
        queryFn: () => getNutritionAnalytics(range),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    return {
        analytics: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
}

function useRefreshNutritionData() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: nutritionKeys.all });
        queryClient.invalidateQueries({ queryKey: overviewKeys.all });
    };
}

export function useCreateMeal() {
    const refresh = useRefreshNutritionData();

    const mutation = useMutation({
        mutationFn: createMeal,
        onSuccess: refresh,
    });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useUpdateMeal() {
    const refresh = useRefreshNutritionData();

    const mutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateMealPayload }) =>
            updateMeal(id, payload),
        onSuccess: refresh,
    });

    return {
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}

export function useDeleteMeal() {
    const refresh = useRefreshNutritionData();

    const mutation = useMutation({
        mutationFn: deleteMeal,
        onSuccess: refresh,
    });

    return {
        removeAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}