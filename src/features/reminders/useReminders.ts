import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/stores/authStore";
import {
    createReminder,
    deleteReminder,
    getReminders,
    updateReminder,
} from "@/services/reminderService";
import type {
    CreateReminderPayload,
    ReminderItem,
    UpdateReminderPayload,
} from "@/types/reminder";

export const reminderKeys = {
    all: ["reminders"] as const,
};

export function useReminders() {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<ReminderItem[]>({
        queryKey: reminderKeys.all,
        queryFn: getReminders,
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
    });

    return {
        reminders: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}

export function useCreateReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateReminderPayload) => createReminder(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reminderKeys.all });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
            toast.success("Reminder created");
        },
        onError: () => {
            toast.error("Failed to create reminder");
        },
    });
}

export function useUpdateReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateReminderPayload }) =>
            updateReminder(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reminderKeys.all });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
            toast.success("Reminder updated");
        },
        onError: () => {
            toast.error("Failed to update reminder");
        },
    });
}

export function useDeleteReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteReminder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reminderKeys.all });
            queryClient.invalidateQueries({ queryKey: ["overview"] });
            toast.success("Reminder deleted");
        },
        onError: () => {
            toast.error("Failed to delete reminder");
        },
    });
}
