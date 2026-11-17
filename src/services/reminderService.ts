import { api } from "@/lib/api";
import type {
    CreateReminderPayload,
    ReminderItem,
    UpdateReminderPayload,
} from "@/types/reminder";

export async function getReminders(): Promise<ReminderItem[]> {
    const { data } = await api.get("/reminders");
    return data.data;
}

export async function createReminder(payload: CreateReminderPayload): Promise<ReminderItem> {
    const { data } = await api.post("/reminders", payload);
    return data.data;
}

export async function updateReminder(
    id: string,
    payload: UpdateReminderPayload,
): Promise<ReminderItem> {
    const { data } = await api.patch(`/reminders/${id}`, payload);
    return data.data;
}

export async function deleteReminder(id: string): Promise<void> {
    await api.delete(`/reminders/${id}`);
}
