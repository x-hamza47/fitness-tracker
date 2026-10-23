import { api } from "@/lib/api";
import type { TicketItem, TicketStatus } from "@/types/ticket";

export type AdminActivityPoint = {
    date: string;
    newUsers: number;
    workouts: number;
};

export type AdminStats = {
    totalUsers: number;
    activeUsers: number;
    newUsersThisWeek: number;
    workoutsLogged: number;
    mealsLogged: number;
    openTickets: number;
    activityTrend?: AdminActivityPoint[];
    recentUsers?: AdminUserItem[];
    recentTickets?: TicketItem[];
};

export type AdminUserItem = {
    id: string;
    name: string;
    username: string;
    email: string;
    role: "user" | "admin";
    isActive: boolean;
    createdAt: string;
    profilePicture?: string | null;
};

export type AdminUsersResponse = {
    users: AdminUserItem[];
    total: number;
    page: number;
    pages: number;
};

export type AdminTicketsResponse = {
    tickets: TicketItem[];
    total: number;
    page: number;
    pages: number;
};

export async function getAdminStats(): Promise<AdminStats> {
    const { data } = await api.get("/admin/stats");
    return data.data;
}

export async function getAdminUsers(params: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
}): Promise<AdminUsersResponse> {
    const { data } = await api.get("/admin/users", { params });
    return data.data;
}

export type CreateAdminUserPayload = {
    name: string;
    username: string;
    email: string;
    password: string;
    role: "user" | "admin";
    isActive?: boolean;
};

export type UpdateAdminUserPayload = {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: "user" | "admin";
    isActive?: boolean;
};

export type AdminUserDetails = AdminUserItem & {
    bio?: string;
    dateOfBirth?: string;
    sex?: string;
    height?: number;
    weight?: number;
    goal?: string;
    activityLevel?: string;
    stats: {
        workoutsCount: number;
        mealsCount: number;
        ticketsCount: number;
    };
};

export async function createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUserItem> {
    const { data } = await api.post("/admin/users", payload);
    return data.data;
}

export async function updateAdminUser(
    id: string,
    payload: UpdateAdminUserPayload,
): Promise<AdminUserItem> {
    const { data } = await api.patch(`/admin/users/${id}`, payload);
    return data.data;
}

export async function getAdminUserDetails(id: string): Promise<AdminUserDetails> {
    const { data } = await api.get(`/admin/users/${id}`);
    return data.data;
}

export async function toggleUserStatus(id: string): Promise<AdminUserItem> {
    const { data } = await api.patch(`/admin/users/${id}/status`);
    return data.data;
}

export async function deleteUserByAdmin(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
}

export async function getAdminTickets(params: {
    status?: string;
    page?: number;
    limit?: number;
}): Promise<AdminTicketsResponse> {
    const { data } = await api.get("/admin/tickets", { params });
    return data.data;
}

export async function updateAdminTicket(
    id: string,
    payload: { status?: TicketStatus; adminReply?: string },
): Promise<TicketItem> {
    const { data } = await api.patch(`/admin/tickets/${id}`, payload);
    return data.data;
}

export async function deleteAdminTicket(id: string): Promise<void> {
    await api.delete(`/admin/tickets/${id}`);
}

