import { api } from "@/lib/api";
import type { UpdateProfilePayload, UserProfile } from "@/types/profile";

export async function getProfile(): Promise<UserProfile> {
    const { data } = await api.get("/users/me");
    return data.data;
}

export async function updateProfile(
    payload: UpdateProfilePayload,
): Promise<UserProfile> {
    const form = new FormData();

    const { avatar, ...fields } = payload;

    Object.entries(fields).forEach(([key, value]) => {
        if (value === undefined) return;
        form.append(key, value === null ? "" : String(value));
    });

    if (avatar instanceof File) form.append("avatar", avatar);
    if (avatar === null) form.append("removeAvatar", "true");

    const { data } = await api.patch("/users/me", form);
    return data.data;
}