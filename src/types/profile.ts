export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export type UnitSystem = "metric" | "imperial";

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
    
    avatarUrl: string | null;
    bio: string;
    goal: string;
    level: FitnessLevel;
    
    joinedAt: string;
    stats: ProfileStats;
};


export type UpdateProfilePayload = Partial<
    Pick<UserProfile, "name" | "username" | "bio" | "goal" | "level">
> & {
    
    avatar?: File | null;
};