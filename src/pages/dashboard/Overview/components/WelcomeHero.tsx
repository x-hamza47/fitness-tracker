import { useEffect, useState } from "react";
import heroImg from "@/assets/dashboard-reveal.webp";
import type { ReminderLike } from "./CalendarCard";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

function greeting(h: number) {
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
}

const pad = (n: number) => String(n).padStart(2, "0");
function clock12(d: Date) {
    const h = d.getHours();
    return {
        text: `${pad(h % 12 || 12)}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
        period: h < 12 ? "AM" : "PM",
    };
}

function countdown(ms: number) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d > 0 ? `${d}d ` : ""}${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

type Props = {
    name?: string;
    reminders?: ReminderLike[];
    followers?: number;
};
function Digit({ ch, small }: { ch: string; small?: boolean }) {
    return (
        <span
            className={cn(
                "relative flex items-center justify-center overflow-hidden font-mono font-semibold text-(--color-accent) tabular-nums [text-shadow:0_0_14px_rgb(255_106_0/0.7)]",
                small ? "h-7 w-4 text-lg" : "h-8 w-5 text-xl sm:h-12 sm:w-8 sm:text-4xl",
            )}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={ch}
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    {ch}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

function Digits({ value, small }: { value: string; small?: boolean }) {
    return (
        <span aria-hidden="true" className="inline-flex flex-wrap items-center gap-x-0.5 sm:gap-x-1">
            {value.split("").map((ch, i) =>
                /\d/.test(ch) ? (
                    <Digit key={i} ch={ch} small={small} />
                ) : (
                    <span
                        key={i}
                        className={cn(
                            "font-mono text-white/50",
                            ch === " " ? "w-1" : small ? "text-lg" : "text-xl sm:text-3xl",
                        )}
                    >
                        {ch}
                    </span>
                ),
            )}
        </span>
    );
}
export default function WelcomeHero({ name, reminders = [], followers }: Props) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const next = reminders
        .filter((r) => +new Date(r.at) > +now)
        .sort((a, b) => +new Date(a.at) - +new Date(b.at))[0];

    return (
        <section
            aria-label="Welcome"
            className="relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-2xl border border-white/15 p-6 shadow-[0_8px_32px_rgb(0_0_0/0.35)] backdrop-blur-sm sm:p-8"
        >
            { }
            <img
                src={heroImg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 size-full object-cover opacity-30"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-br from-black/70 via-black/40 to-(--color-accent)/20"
            />
            <div
                aria-hidden="true"
                className="absolute -top-16 -left-16 size-64 rounded-full bg-(--color-accent)/25 blur-3xl"
            />

            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">
                        {now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                        {greeting(now.getHours())},
                        <br />
                        <span className="bg-linear-to-r from-(--color-accent) to-(--color-accent-dark) bg-clip-text text-transparent">
                            {name ?? "Athlete"}
                        </span>
                    </h1>
                    <p className="mt-3 max-w-md text-sm text-white/60">
                        Here is your fitness overview. Keep your streak alive today.
                    </p>
                </div>

                <time dateTime={now.toISOString()} className="hidden shrink-0 items-end gap-1.5 sm:flex">
                    <Digits small value={clock12(now).text} />
                    <span className="pb-0.5 font-mono text-sm font-semibold text-(--color-accent)">
                        {clock12(now).period}
                    </span>
                </time>
            </div>

            <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">Next reminder</p>
                    {next ? (
                        <>
                            <p className="mt-1 truncate text-sm text-white">{next.title}</p>
                            <div className="mt-2">
                                <span className="sr-only">Time until next reminder: {countdown(+new Date(next.at) - +now)}</span>
                                <Digits value={countdown(+new Date(next.at) - +now)} />
                            </div>
                        </>
                    ) : (
                        <p className="mt-2 text-sm text-white/50">No upcoming reminders. Add one to stay on track.</p>
                    )}
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">Followers</p>
                    <p className="mt-1 text-2xl font-semibold text-white tabular-nums">{followers ?? 0}</p>
                    <p className="mt-1 text-xs text-white/50">See the full list in the sidebar.</p>
                </div>
            </div>
        </section>
    );
}