import { api } from "@/lib/api";
import type { CreateTicketPayload, TicketItem } from "@/types/ticket";

export async function getMyTickets(): Promise<TicketItem[]> {
    const { data } = await api.get("/tickets");
    return data.data;
}

export async function createTicket(payload: CreateTicketPayload): Promise<TicketItem> {
    const { data } = await api.post("/tickets", payload);
    return data.data;
}
