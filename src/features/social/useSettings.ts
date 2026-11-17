import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/stores/authStore";
import { getAuthErrorMessage } from "@/services/authService";
import { getSettings, updateSettings } from "@/services/settingsService";
import { profileKeys } from "@/features/profile/useProfile";
import type { Settings, UpdateSettingsPayload } from "@/types/social";
import { useEffect } from "react";
import { useUiStore } from "@/stores/uiStore";
export const settingsKeys = {
    me: ["settings", "me"] as const,
};
export function useSettings() {
    const isAuthenticated = useIsAuthenticated();
    const setUnitSystem = useUiStore((s) => s.setUnitSystem);

    const query = useQuery<Settings>({
        queryKey: settingsKeys.me,
        queryFn: getSettings,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    const units = query.data?.units;
    useEffect(() => {
        if (units) setUnitSystem(units);
    }, [units, setUnitSystem]);

    return {
        settings: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: UpdateSettingsPayload) => updateSettings(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(settingsKeys.me, updated);
            queryClient.invalidateQueries({ queryKey: profileKeys.all });
            toast.success("Settings saved");
        },
        onError: (error) => toast.error(getAuthErrorMessage(error)),
    });

    return {
        submit: mutation.mutate,
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
    };
}