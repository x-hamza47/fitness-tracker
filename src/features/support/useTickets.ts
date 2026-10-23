import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIsAuthenticated } from "@/stores/authStore";
import { createTicket, getMyTickets } from "@/services/ticketService";
import type { CreateTicketPayload, TicketItem } from "@/types/ticket";

export const ticketKeys = {
    all: ["tickets"] as const,
    my: () => ["tickets", "my"] as const,
};

export function useMyTickets() {
    const isAuthenticated = useIsAuthenticated();

    const query = useQuery<TicketItem[]>({
        queryKey: ticketKeys.my(),
        queryFn: getMyTickets,
        enabled: isAuthenticated,
        staleTime: 60 * 1000,
    });

    return {
        tickets: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}

export function useCreateTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTicketPayload) => createTicket(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.my() });
            toast.success("Support ticket submitted. Our team will review it shortly.");
        },
        onError: () => {
            toast.error("Failed to submit support ticket. Please try again.");
        },
    });
}
