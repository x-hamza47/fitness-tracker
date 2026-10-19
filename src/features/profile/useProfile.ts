import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/stores/authStore";
import { getAuthErrorMessage } from "@/services/authService";
import { getProfile, updateProfile } from "@/services/profileService";
import type { UpdateProfilePayload, UserProfile } from "@/types/profile";

export const profileKeys = {
    all: ["profile"] as const,
    me: () => [...profileKeys.all, "me"] as const,
};

/** Current user's profile. Shared by the sidebar, profile page and settings. */
export function useProfile() {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<UserProfile>({
        queryKey: profileKeys.me(),
        queryFn: getProfile,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    return {
        profile: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}

/** Updates the profile and instantly refreshes every component that reads it. */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(profileKeys.me(), updated);
        },
    });

    return {
        submit: mutation.mutate,
        submitAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        errorMessage: mutation.isError ? getAuthErrorMessage(mutation.error) : null,
        reset: mutation.reset,
    };
}