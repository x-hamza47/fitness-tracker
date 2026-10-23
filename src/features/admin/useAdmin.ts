import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import {
    deleteUserByAdmin,
    getAdminStats,
    getAdminTickets,
    getAdminUsers,
    getAdminUserDetails,
    createAdminUser,
    updateAdminUser,
    deleteAdminTicket,
    toggleUserStatus,
    updateAdminTicket,
    type CreateAdminUserPayload,
    type UpdateAdminUserPayload,
} from "@/services/adminService";
import type { TicketStatus } from "@/types/ticket";

export const adminKeys = {
    all: ["admin"] as const,
    stats: () => ["admin", "stats"] as const,
    users: (params: Record<string, unknown>) => ["admin", "users", params] as const,
    userDetails: (id: string) => ["admin", "user", id] as const,
    tickets: (params: Record<string, unknown>) => ["admin", "tickets", params] as const,
};

export function useAdminStats() {
    const role = useAuthStore((s) => s.user?.role);

    return useQuery({
        queryKey: adminKeys.stats(),
        queryFn: getAdminStats,
        enabled: role === "admin",
        staleTime: 30 * 1000,
    });
}

export function useAdminUsers(params: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
}) {
    const role = useAuthStore((s) => s.user?.role);

    return useQuery({
        queryKey: adminKeys.users(params),
        queryFn: () => getAdminUsers(params),
        enabled: role === "admin",
        staleTime: 30 * 1000,
    });
}

export function useAdminUserDetails(id: string | null) {
    const role = useAuthStore((s) => s.user?.role);

    return useQuery({
        queryKey: adminKeys.userDetails(id ?? ""),
        queryFn: () => getAdminUserDetails(id!),
        enabled: role === "admin" && !!id,
        staleTime: 30 * 1000,
    });
}

export function useCreateAdminUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateAdminUserPayload) => createAdminUser(payload),
        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            toast.success(`Account for "${created.name}" created successfully`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to create user");
        },
    });
}

export function useUpdateAdminUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminUserPayload }) =>
            updateAdminUser(id, payload),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: adminKeys.userDetails(updated.id) });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            toast.success(`Account "${updated.name}" updated`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to update user");
        },
    });
}

export function useToggleUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleUserStatus(id),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            toast.success(`User ${updated.isActive ? "activated" : "deactivated"}`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to toggle status");
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteUserByAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            toast.success("User account and all data deleted");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to delete user");
        },
    });
}

export function useAdminTickets(params: {
    status?: string;
    page?: number;
    limit?: number;
}) {
    const role = useAuthStore((s) => s.user?.role);

    return useQuery({
        queryKey: adminKeys.tickets(params),
        queryFn: () => getAdminTickets(params),
        enabled: role === "admin",
        staleTime: 30 * 1000,
    });
}

export function useUpdateAdminTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: { status?: TicketStatus; adminReply?: string } }) =>
            updateAdminTicket(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            toast.success("Ticket updated");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to update ticket");
        },
    });
}

export function useDeleteAdminTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAdminTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
            queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
            toast.success("Support ticket deleted");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to delete ticket");
        },
    });
}

