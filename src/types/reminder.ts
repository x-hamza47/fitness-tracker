export type ReminderKind = "workout" | "meal" | "goal";

export type ReminderItem = {
    id: string;
    title: string;
    kind: ReminderKind;
    time: string;
    days: number[];
    active: boolean;
    lastTriggeredAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateReminderPayload = {
    title: string;
    kind: ReminderKind;
    time: string;
    days: number[];
    active?: boolean;
};

export type UpdateReminderPayload = Partial<CreateReminderPayload>;
