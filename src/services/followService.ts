import { api } from "@/lib/api";
import type { FollowRequest, FollowStatus, Paginated, UserSummary } from "@/types/social";

type PageParams = { page?: number; limit?: number };

export async function followUser(id: string): Promise<{ status: Exclude<FollowStatus, null> }> {
    const { data } = await api.post(`/users/${id}/follow`);
    return data.data;
}

export async function unfollowUser(id: string): Promise<void> {
    await api.delete(`/users/${id}/follow`);
}

export async function removeFollower(id: string): Promise<void> {
    await api.delete(`/users/${id}/followers`);
}

export async function getFollowers(id: string, params: PageParams = {}): Promise<Paginated<UserSummary>> {
    const { data } = await api.get(`/users/${id}/followers`, { params });
    return data.data;
}

export async function getFollowing(id: string, params: PageParams = {}): Promise<Paginated<UserSummary>> {
    const { data } = await api.get(`/users/${id}/following`, { params });
    return data.data;
}

export async function getRequests(params: PageParams = {}): Promise<Paginated<FollowRequest>> {
    const { data } = await api.get("/users/requests", { params });
    return data.data;
}

export async function approveRequest(requestId: string): Promise<void> {
    await api.patch(`/users/requests/${requestId}/approve`);
}

export async function rejectRequest(requestId: string): Promise<void> {
    await api.delete(`/users/requests/${requestId}`);
}

export async function searchUsers(q: string, params: PageParams = {}): Promise<Paginated<UserSummary>> {
    const { data } = await api.get("/users/search", { params: { q, ...params } });
    return data.data;
}