import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/stores/authStore";
import { getOverview } from "@/services/userService";
import type { DateRange, OverviewData } from "@/types/dashboard";

export const overviewKeys = {
    all: ["overview"] as const,
    range: (range: DateRange) => [...overviewKeys.all, range] as const, 
};

export function useOverview(range: DateRange) {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<OverviewData>({
        queryKey: overviewKeys.range(range),
        queryFn: () => getOverview(range),
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
        placeholderData: keepPreviousData,
    });

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        isRefetching: query.isPlaceholderData,
        isError: query.isError,
        refetch: query.refetch,
    };
}