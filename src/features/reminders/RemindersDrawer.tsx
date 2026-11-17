import { useState } from "react";
import {
    IconBarbell,
    IconBell,
    IconPlus,
    IconTarget,
    IconToolsKitchen2,
    IconTrash,
} from "@tabler/icons-react";
import Drawer from "@/components/ui/Drawer";
import {
    useCreateReminder,
    useDeleteReminder,
    useReminders,
    useUpdateReminder,
} from "./useReminders";
import type { ReminderKind } from "@/types/reminder";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const KIND_ICONS: Record<ReminderKind, typeof IconBarbell> = {
    workout: IconBarbell,
    meal: IconToolsKitchen2,
    goal: IconTarget,
};

type RemindersDrawerProps = {
    open: boolean;
    onClose: () => void;
};

export default function RemindersDrawer({ open, onClose }: RemindersDrawerProps) {
    const { reminders, isLoading } = useReminders();
    const create = useCreateReminder();
    const update = useUpdateReminder();
    const del = useDeleteReminder();

    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState("");
    const [kind, setKind] = useState<ReminderKind>("workout");
    const [time, setTime] = useState("08:00");
    const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);

    const toggleDay = (dayIdx: number) => {
        setDays((prev) =>
            prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx].sort(),
        );
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || days.length === 0) return;

        await create.mutateAsync({
            title: title.trim(),
            kind,
            time,
            days,
            active: true,
        });

        setTitle("");
        setIsCreating(false);
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            title="Manage Reminders"
            description="Configure alerts and schedules for your workouts, meals, and goals."
        >
            <div className="space-y-5">
                {!isCreating ? (
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-white/20 p-3 text-xs font-semibold tracking-[0.15em] text-white/80 uppercase transition-colors hover:border-(--color-accent) hover:text-(--color-accent)"
                    >
                        <IconPlus size={16} /> Add new reminder
                    </button>
                ) : (
                    <form
                        onSubmit={handleCreate}
                        className="rounded-sm border border-white/10 bg-white/3 p-4 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-white uppercase">
                                New Reminder
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="text-xs text-white/50 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>

                        <div>
                            <label className="block text-[11px] text-(--color-text-muted) mb-1">Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Morning Upper Body Session"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] text-(--color-text-muted) mb-1">Category</label>
                                <select
                                    value={kind}
                                    onChange={(e) => setKind(e.target.value as ReminderKind)}
                                    className="w-full rounded-sm border border-white/15 bg-white/5 px-2.5 py-2 text-xs text-white focus:border-white/40 focus:outline-none scheme-dark"
                                >
                                    <option value="workout">Workout</option>
                                    <option value="meal">Meal</option>
                                    <option value="goal">Goal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] text-(--color-text-muted) mb-1">Time (24h)</label>
                                <input
                                    type="time"
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none scheme-dark"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] text-(--color-text-muted) mb-1.5">Repeat Days</label>
                            <div className="flex gap-1.5">
                                {DAYS_OF_WEEK.map((dayLabel, idx) => {
                                    const active = days.includes(idx);
                                    return (
                                        <button
                                            key={dayLabel}
                                            type="button"
                                            onClick={() => toggleDay(idx)}
                                            className={cn(
                                                "flex size-7 items-center justify-center rounded-sm text-[10px] font-semibold transition-colors cursor-pointer",
                                                active
                                                    ? "bg-(--color-accent) text-black"
                                                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white",
                                            )}
                                        >
                                            {dayLabel[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={create.isPending || !title.trim() || days.length === 0}
                            className="mt-2 w-full cursor-pointer rounded-sm bg-(--color-accent) py-2.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {create.isPending ? "Saving..." : "Save Reminder"}
                        </button>
                    </form>
                )}

                {/* Reminders List */}
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase">
                        Active Reminders ({reminders.length})
                    </p>

                    {isLoading ? (
                        <div className="space-y-2">
                            <div className="h-16 animate-pulse rounded-sm bg-white/5" />
                            <div className="h-16 animate-pulse rounded-sm bg-white/5" />
                        </div>
                    ) : reminders.length === 0 ? (
                        <div className="rounded-sm border border-dashed border-white/10 p-6 text-center text-xs text-(--color-text-muted)">
                            No reminders set. Create one above to receive timely alerts.
                        </div>
                    ) : (
                        reminders.map((r) => {
                            const Icon = KIND_ICONS[r.kind] ?? IconBell;
                            return (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between gap-3 rounded-sm border border-white/10 bg-white/2 p-3.5 transition-colors hover:border-white/20"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-white/5 text-white/70">
                                            <Icon size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {r.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-(--color-text-muted)">
                                                <span className="font-mono text-white/80">{r.time}</span>
                                                <span>·</span>
                                                <span>
                                                    {r.days.length === 7
                                                        ? "Every day"
                                                        : r.days.map((d) => DAYS_OF_WEEK[d]).join(", ")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => update.mutate({ id: r.id, payload: { active: !r.active } })}
                                            className={cn(
                                                "cursor-pointer rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase transition-colors",
                                                r.active
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : "bg-white/5 text-white/40 border border-white/10",
                                            )}
                                        >
                                            {r.active ? "Active" : "Paused"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => del.mutate(r.id)}
                                            className="cursor-pointer rounded-sm p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            title="Delete reminder"
                                        >
                                            <IconTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Drawer>
    );
}
