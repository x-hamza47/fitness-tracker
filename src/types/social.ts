import type { UnitSystem } from "@/types/profile";

export type FollowStatus = "pending" | "accepted" | null;

export type UserSummary = {
    id: string;
    name: string;
    username: string;
    profilePicture: string | null;
    followStatus: FollowStatus;
};

export type Paginated<T> = {
    items: T[];
    total: number;
    page: number;
    pages: number;
};

export type FollowRequest = {
    requestId: string;
    createdAt: string;
    user: UserSummary;
};

export type NotificationType =
    | "new_follower"
    | "follow_request"
    | "follow_accepted"
    | "workout_completed"
    | "goal_achieved"
    | "reminder";

export type AppNotification = {
    id: string;
    type: NotificationType;
    message: string;
    read: boolean;
    createdAt: string;
    actor: Omit<UserSummary, "followStatus"> | null;
};

export type Settings = {
    units: UnitSystem;
    notifications: {
        workout: boolean;
        meal: boolean;
        goal: boolean;
    };
    privacy: {
        isPrivate: boolean;
        searchable: boolean;
        showStats: boolean;
    };
};

export type UpdateSettingsPayload = {
    units?: UnitSystem;
    notifications?: Partial<Settings["notifications"]>;
    privacy?: Partial<Settings["privacy"]>;
};