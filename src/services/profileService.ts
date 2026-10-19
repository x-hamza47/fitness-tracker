import type { UpdateProfilePayload, UserProfile } from "@/types/profile";

/**
 * Mock "database" for the profile. Kept in module scope so edits
 * persist while the app is running (until a page refresh).
 * When the real API is ready, delete this and use the REAL API blocks.
 */
let mockProfile: UserProfile = {
    id: "1",
    name: "Forge Athlete",
    username: "forge_athlete",
    email: "athlete@forge.app",
    avatarUrl: null,
    bio: "Lifting heavy, eating clean, chasing PRs.",
    goal: "Build muscle and run a 10K",
    level: "intermediate",
    joinedAt: "2025-01-15T00:00:00.000Z",
    stats: {
        followers: 128,
        following: 64,
        workouts: 214,
    },
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Keeps the mock avatar usable after "upload" without a server. */
function fileToObjectUrl(file: File): string {
    return URL.createObjectURL(file);
}

export async function getProfile(): Promise<UserProfile> {
    // --- REAL API ---
    // const { data } = await api.get<UserProfile>("/users/me");
    // return data;

    await wait(500);
    return mockProfile;
}

export async function updateProfile(
    payload: UpdateProfilePayload,
): Promise<UserProfile> {
    // --- REAL API ---
    // const form = new FormData();
    // Object.entries(payload).forEach(([key, value]) => {
    //     if (key === "avatar") return;
    //     if (value !== undefined) form.append(key, String(value));
    // });
    // if (payload.avatar instanceof File) form.append("avatar", payload.avatar);
    // if (payload.avatar === null) form.append("removeAvatar", "true");
    // const { data } = await api.patch<UserProfile>("/users/me", form);
    // return data;

    await wait(700);

    const { avatar, ...fields } = payload;

    mockProfile = {
        ...mockProfile,
        ...fields,
        avatarUrl:
            avatar === undefined
                ? mockProfile.avatarUrl
                : avatar === null
                  ? null
                  : fileToObjectUrl(avatar),
    };

    return mockProfile;
}