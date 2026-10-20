import { useState } from "react";
import { DayPicker } from "react-day-picker";

export type ReminderLike = { id: string | number; title: string; at: string };

type Props = {
    reminders?: ReminderLike[];
    workoutDays?: Date[];
};

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export default function CalendarCard({ reminders = [], workoutDays = [] }: Props) {
    const [selected, setSelected] = useState<Date>(new Date());

    const dayReminders = reminders
        .filter((r) => sameDay(new Date(r.at), selected))
        .sort((a, b) => +new Date(a.at) - +new Date(b.at));

    const reminderDays = reminders.map((r) => new Date(r.at));

    return (
        <section
            aria-label="Calendar"
            className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-linear-to-br from-white/12 via-white/5 to-white/2 p-4 shadow-[0_8px_32px_rgb(0_0_0/0.35)] backdrop-blur-md"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-(--color-accent)/20 blur-2xl"
            />

            <DayPicker
                mode="single"
                required
                selected={selected}
                onSelect={setSelected}
                showOutsideDays
                modifiers={{ workout: workoutDays, reminder: reminderDays }}
                modifiersClassNames={{
                    workout:
                        "after:absolute after:bottom-0.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-(--color-accent)",
                    reminder: "[&>button]:font-semibold [&>button]:text-white",
                }}
                classNames={{
                    root: "relative w-full",
                    months: "relative",
                    month: "w-full",
                    month_caption: "flex h-8 items-center",
                    caption_label: "text-sm font-medium text-white",
                    nav: "absolute right-0 top-0 flex items-center gap-1",
                    button_previous:
                        "flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white",
                    button_next:
                        "flex size-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white",
                    month_grid: "mt-2 w-full border-collapse",
                    weekday:
                        "pb-2 text-center text-[10px] font-normal tracking-widest text-white/40 uppercase",
                    week: "",
                    day: "relative p-0 text-center",
                    day_button:
                        "mx-auto flex size-9 items-center justify-center rounded-lg text-sm text-white/80 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-(--color-accent)",
                    outside: "opacity-30",
                    today: "[&>button]:border [&>button]:border-(--color-accent)/60",
                    selected:
                        "[&>button]:bg-(--color-accent) [&>button]:font-semibold [&>button]:text-black [&>button]:hover:bg-(--color-accent)",
                }}
            />

            <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">
                    {selected.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}
                </p>
                {dayReminders.length === 0 ? (
                    <p className="mt-2 text-xs text-white/40">No reminders this day.</p>
                ) : (
                    <ul className="mt-2 space-y-1.5">
                        {dayReminders.slice(0, 3).map((r) => (
                            <li key={r.id} className="flex items-center justify-between gap-3 text-xs">
                                <span className="truncate text-white/80">{r.title}</span>
                                <span className="shrink-0 text-(--color-accent) tabular-nums">
                                    {new Date(r.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}