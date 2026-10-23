import type { UserProfile } from "@/types/profile";

export const REQUIRED_PROFILE_FIELDS = [
    "weight",
    "height",
    "dateOfBirth",
    "sex",
    "goal",
    "activityLevel",
] as const;

export function getMissingProfileFields(profile: UserProfile | null): string[] {
    if (!profile) return [...REQUIRED_PROFILE_FIELDS];
    if (profile.role === "admin") return [];

    const missing: string[] = [];

    if (profile.weight === null || profile.weight === undefined || profile.weight <= 0) {
        missing.push("weight");
    }
    if (profile.height === null || profile.height === undefined || profile.height <= 0) {
        missing.push("height");
    }
    if (!profile.dateOfBirth) {
        missing.push("date of birth");
    }
    if (!profile.sex) {
        missing.push("sex");
    }
    if (!profile.goal) {
        missing.push("goal");
    }
    if (!profile.activityLevel) {
        missing.push("activity level");
    }

    return missing;
}

export function isProfileComplete(profile: UserProfile | null): boolean {
    if (!profile) return false;
    if (profile.role === "admin") return true;
    return getMissingProfileFields(profile).length === 0;
}
