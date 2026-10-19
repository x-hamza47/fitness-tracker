import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/stores/authStore";
import { getOverview } from "@/services/userService";
import type { DateRange, OverviewData } from "@/types/dashboard";

export const overviewKeys = {
    all: ["overview"] as const,
    range: (range: DateRange) => [...overviewKeys.all, range] as const,
};

/** Everything the Overview page needs, cached per date range. */
export function useOverview(range: DateRange) {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<OverviewData>({
        queryKey: overviewKeys.range(range),
        queryFn: () => getOverview(range),
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
        // Keep showing the old range's data while the new one loads,
        // so the page doesn't flash back to skeletons when switching 7D/30D/90D.
        placeholderData: keepPreviousData,
    });

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        /** true while switching range and showing the previous data */
        isRefetching: query.isPlaceholderData,
        isError: query.isError,
        refetch: query.refetch,
    };
}