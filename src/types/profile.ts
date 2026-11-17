import type { Settings } from "@/types/social";

export type UnitSystem = "metric" | "imperial";

export type Role = "user" | "admin";

export type Sex = "male" | "female" | "other";

export type Goal = "weight_loss" | "muscle_gain" | "maintenance" | "endurance";

export type ActivityLevel =
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active";

export type ProfileStats = {
    followers: number;
    following: number;
    workouts: number;
};

export type UserProfile = {
    id: string;
    name: string;
    username: string;
    email: string;
    role: Role;

    profilePicture: string | null;
    bio: string;
    dateOfBirth: string | null;
    sex: Sex | null;
    height: number | null;
    weight: number | null;
    targetWeight: number | null;
    goal: Goal | null;
    activityLevel: ActivityLevel | null;
    preferences: Settings;
    createdAt: string;
    stats: ProfileStats;
};

export type UpdateProfilePayload = Partial<
    Pick<
        UserProfile,
        | "name"
        | "username"
        | "bio"
        | "dateOfBirth"
        | "sex"
        | "height"
        | "weight"
        | "targetWeight"
        | "goal"
        | "activityLevel"
    >
> & {
    avatar?: File | null;
};