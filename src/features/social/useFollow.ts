import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/stores/authStore";
import { getAuthErrorMessage } from "@/services/authService";
import {
    approveRequest,
    followUser,
    getFollowers,
    getFollowing,
    getRequests,
    rejectRequest,
    removeFollower,
    searchUsers,
    unfollowUser,
} from "@/services/followService";
import { profileKeys } from "@/features/profile/useProfile";
import { notificationKeys } from "@/features/social/useNotifications";

export const followKeys = {
    all: ["follow"] as const,
    followers: (id: string, page: number) => [...followKeys.all, "followers", id, page] as const,
    following: (id: string, page: number) => [...followKeys.all, "following", id, page] as const,
    requests: (page: number) => [...followKeys.all, "requests", page] as const,
    search: (q: string, page: number) => [...followKeys.all, "search", q, page] as const,
};

export function useFollowers(id: string | undefined, page = 1) {
    return useQuery({
        queryKey: followKeys.followers(id ?? "", page),
        queryFn: () => getFollowers(id!, { page }),
        enabled: !!id,
        placeholderData: keepPreviousData,
    });
}

export function useFollowing(id: string | undefined, page = 1) {
    return useQuery({
        queryKey: followKeys.following(id ?? "", page),
        queryFn: () => getFollowing(id!, { page }),
        enabled: !!id,
        placeholderData: keepPreviousData,
    });
}

export function useRequests(page = 1) {
    const isAuthenticated = useIsAuthenticated();
    return useQuery({
        queryKey: followKeys.requests(page),
        queryFn: () => getRequests({ page }),
        enabled: isAuthenticated,
        refetchInterval: 30_000,
    });
}

export function useSearchUsers(q: string, page = 1) {
    const term = q.trim();
    return useQuery({
        queryKey: followKeys.search(term, page),
        queryFn: () => searchUsers(term, { page }),
        enabled: term.length >= 2,
        placeholderData: keepPreviousData,
    });
}

function useRefreshSocial() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: followKeys.all });
        queryClient.invalidateQueries({ queryKey: profileKeys.all });
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    };
}

export function useFollowUser() {
    const refresh = useRefreshSocial();
    return useMutation({
        mutationFn: followUser,
        onSuccess: ({ status }) => {
            refresh();
            toast.success(status === "pending" ? "Follow request sent" : "Followed");
        },
        onError: (error) => toast.error(getAuthErrorMessage(error)),
    });
}

export function useUnfollowUser() {
    const refresh = useRefreshSocial();
    return useMutation({
        mutationFn: unfollowUser,
        onSuccess: () => {
            refresh();
            toast.success("Unfollowed");
        },
        onError: (error) => toast.error(getAuthErrorMessage(error)),
    });
}

export function useRemoveFollower() {
    const refresh = useRefreshSocial();
    return useMutation({
        mutationFn: removeFollower,
        onSuccess: () => {
            refresh();
            toast.success("Follower removed");
        },
        onError: (error) => toast.error(getAuthErrorMessage(error)),
    });
}

export function useApproveRequest() {
    const refresh = useRefreshSocial();
    return useMutation({
        mutationFn: approveRequest,
        onSuccess: () => {
            refresh();
            toast.success("Request approved");
        },
        onError: (error) => toast.error(getAuthErrorMessage(error)),
    });
}

export function useRejectRequest() {
    const refresh = useRefreshSocial();
    return useMutation({
        mutationFn: rejectRequest,
        onSuccess: () => {
            refresh();
            toast.success("Request rejected");
        },
        onError: (error) => toast.error(getAuthErrorMessage(error)),
    });
}