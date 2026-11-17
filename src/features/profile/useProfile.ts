import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/stores/authStore";
import { getAuthErrorMessage } from "@/services/authService";
import { getProfile, updateProfile, getPublicProfile, type PublicProfile } from "@/services/profileService";
import type { UpdateProfilePayload, UserProfile } from "@/types/profile";
import { toast } from "sonner";

export const profileKeys = {
    all: ["profile"] as const,
    me: () => [...profileKeys.all, "me"] as const,
    public: (username: string) => [...profileKeys.all, "public", username] as const,
};

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

export function usePublicProfile(username: string | null) {
    const isAuthenticated = useIsAuthenticated();

    return useQuery<PublicProfile>({
        queryKey: profileKeys.public(username ?? ""),
        queryFn: () => getPublicProfile(username!),
        enabled: isAuthenticated && !!username,
        staleTime: 30 * 1000,
    });
}



export function useUpdateProfile() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(profileKeys.me(), updated);
            queryClient.invalidateQueries({ queryKey: profileKeys.all });
            queryClient.invalidateQueries({ queryKey: ["nutrition"] });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
            queryClient.invalidateQueries({ queryKey: ["plan"] });
            toast.success("Profile updated");
        },
        onError: (error) => {
            toast.error(getAuthErrorMessage(error));
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