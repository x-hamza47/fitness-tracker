import { api } from "@/lib/api";
import type { Settings, UpdateSettingsPayload } from "@/types/social";

export async function getSettings(): Promise<Settings> {
    const { data } = await api.get("/users/me/settings");
    return data.data;
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<Settings> {
    const { data } = await api.patch("/users/me/settings", payload);
    return data.data;
}