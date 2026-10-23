import { api } from "@/lib/api";
import type { AppNotification, Paginated } from "@/types/social";

export async function getNotifications(page = 1, limit = 20): Promise<Paginated<AppNotification>> {
    const { data } = await api.get("/notifications", { params: { page, limit } });
    return data.data;
}

export async function getUnreadCount(): Promise<number> {
    const { data } = await api.get("/notifications/unread-count");
    return data.data.count;
}

export async function markAllRead(): Promise<void> {
    await api.patch("/notifications/read-all");
}

export async function markRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
}