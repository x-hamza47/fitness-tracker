import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/stores/authStore";
import { getAuthErrorMessage } from "@/services/authService";
import {
    getNotifications,
    getUnreadCount,
    markAllRead,
    markRead,
} from "@/services/notificationService";

export const notificationKeys = {
    all: ["notifications"] as const,
    list: (page: number) => [...notificationKeys.all, "list", page] as const,
    unread: () => [...notificationKeys.all, "unread"] as const,
};

export function useNotifications(page = 1) {
    const isAuthenticated = useIsAuthenticated();
    return useQuery({
        queryKey: notificationKeys.list(page),
        queryFn: () => getNotifications(page),
        enabled: isAuthenticated,
        placeholderData: keepPreviousData,
    });
}

export function useUnreadCount() {
    const isAuthenticated = useIsAuthenticated();
    const query = useQuery({
        queryKey: notificationKeys.unread(),
        queryFn: getUnreadCount,
        enabled: isAuthenticated,
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
    });
    return query.data ?? 0;
}

export function useMarkAllRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markAllRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
        onError: (error) => toast.error(getAuthErrorMessage(error)),
    });
}

export function useMarkRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    });
}