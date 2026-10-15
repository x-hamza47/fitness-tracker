import { memo, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
    IconArrowUpRight,
    IconBell,
    IconChartLine,
    IconFileExport,
    IconFlame,
    IconListDetails,
    IconTags,
    IconTrophy,
} from "@tabler/icons-react";

import MagicBento, { type MagicBentoItem } from "@/components/ui/MagicBento";
import SectionEyebrow from "@/components/ui/SectionEyebrow";


const GLOW = "#ff6a00";

const BENTO_STYLE = {
    "--mb-surface": "linear-gradient(180deg, #0a0a0c 0%, #040405 100%)",
    "--mb-edge": "rgba(255, 255, 255, 0.05)",
    "--mb-highlight": "rgba(255, 255, 255, 0.03)",
    "--mb-shadow": "0 24px 48px -28px rgba(0, 0, 0, 1), 0 8px 18px -12px rgba(0, 0, 0, 0.9)",
} as CSSProperties;


interface CardContentProps {
    icon: ReactNode;
    title: string;
    text: string;
    children: ReactNode;
}

function CardContent({ icon, title, text, children }: CardContentProps) {
    return (
        <>
            <div className="flex items-center gap-3">
                <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/3 text-(--color-accent-dark)"
                >
                    {icon}
                </span>
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold tracking-wide text-(--color-text)">{title}</h3>
                    <p className="text-xs text-(--color-text-muted)">{text}</p>
                </div>
            </div>
            <div className="mt-5 sm:mt-2 flex min-h-0 flex-1 flex-col">{children}</div>
        </>
    );
}


interface RoutineRow {
    name: string;
    sets: string;
    weight: string;
}

const ROUTINE: readonly RoutineRow[] = [
    { name: "Barbell Bench Press", sets: "4 × 6–8", weight: "100 kg" },
    { name: "Incline Dumbbell Press", sets: "4 × 8–10", weight: "32 kg" },
    { name: "Overhead Press", sets: "3 × 6–8", weight: "60 kg" },
    { name: "Cable Fly", sets: "3 × 12–15", weight: "20 kg" },
];

const RoutineVisual = memo(function RoutineVisual() {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between text-xs text-white/45">
                <span className="font-medium text-white/70">Push day</span>
                <span>Sets × reps, weight</span>
            </div>
            <ul className="divide-y divide-white/5 rounded-lg border border-white/10">
                {ROUTINE.map((row) => (
                    <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                        <span className="min-w-0 truncate text-(--color-text)">{row.name}</span>
                        <span className="flex shrink-0 items-center gap-4 tabular-nums">
                            <span className="text-white/50">{row.sets}</span>
                            <span className="w-14 text-right font-semibold text-(--color-text)">{row.weight}</span>
                        </span>
                    </li>
                ))}
            </ul>
            <p className="mt-3 text-xs text-white/40 italic">Note: pause 1s on chest</p>
        </div>
    );
});

const CompareVisual = memo(function CompareVisual() {
    return (
        <div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-xs text-white/45">Last session</p>
                    <p className="mt-1 text-2xl font-semibold text-white/50 tabular-nums">100 kg</p>
                </div>
                <IconArrowUpRight size={20} className="mb-2 text-emerald-400" aria-hidden="true" />
                <div className="text-right">
                    <p className="text-xs text-white/45">Today</p>
                    <p className="mt-1 text-4xl font-bold tracking-tighter text-white tabular-nums">102.5 kg</p>
                </div>
            </div>

            <div className="mt-5 space-y-2" aria-hidden="true">
                <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-[97.5%] rounded-full bg-white/30" />
                </div>
                <div className="h-1.5 rounded-full bg-(--color-accent-dark)" />
            </div>

            <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-400">+2.5 kg</span>
                <span className="flex items-center gap-1 rounded-full bg-(--color-accent-dark) px-2 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                    <IconTrophy size={11} aria-hidden="true" /> New PR
                </span>
            </div>
        </div>
    );
});

interface Metric {
    id: string;
    label: string;
    unit: string;
    decimals: number;

    lowerIsBetter?: boolean;
    values: readonly number[];
}

const METRICS: readonly Metric[] = [
    {
        id: "weight",
        label: "Body weight",
        unit: "kg",
        decimals: 1,
        lowerIsBetter: true,
        values: [82.4, 82.0, 81.6, 81.1, 80.9, 80.2, 79.8, 79.5, 79.0, 78.7, 78.4, 78.1],
    },
    {
        id: "bench",
        label: "Bench press",
        unit: "kg",
        decimals: 1,
        values: [80, 80, 82.5, 85, 85, 87.5, 90, 92.5, 95, 97.5, 100, 102.5],
    },
    {
        id: "sessions",
        label: "Sessions / week",
        unit: "",
        decimals: 0,
        values: [2, 3, 3, 4, 3, 4, 4, 5, 4, 5, 5, 5],
    },
    {
        id: "waist",
        label: "Waist",
        unit: "cm",
        decimals: 1,
        lowerIsBetter: true,
        values: [88, 87.6, 87.1, 86.5, 86.2, 85.4, 85, 84.6, 84.1, 83.8, 83.3, 83],
    },
];

const CHART_W = 400;
const CHART_H = 160;
const CHART_PAD = 12;

interface ChartGeometry {
    line: string;
    area: string;

    end: { x: number; y: number };
}

function buildChart(values: readonly number[]): ChartGeometry {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const lastIndex = values.length - 1;

    const points = values.map((value, index) => {
        const x = (index / lastIndex) * CHART_W;
        const y = CHART_H - CHART_PAD - ((value - min) / range) * (CHART_H - CHART_PAD * 2);
        return [x, y] as const;
    });

    const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${line} L${CHART_W},${CHART_H} L0,${CHART_H} Z`;
    const [endX, endY] = points[lastIndex];

    return { line, area, end: { x: (endX / CHART_W) * 100, y: (endY / CHART_H) * 100 } };
}

const formatValue = (metric: Metric, value: number) =>
    `${value.toFixed(metric.decimals)}${metric.unit ? ` ${metric.unit}` : ""}`;

function ProgressChart() {
    const [activeId, setActiveId] = useState<string>(METRICS[0].id);
    const reduceMotion = useReducedMotion();
    const gradientId = useId();

    const metric = METRICS.find((m) => m.id === activeId) ?? METRICS[0];
    const geometry = useMemo(() => buildChart(metric.values), [metric]);

    const first = metric.values[0];
    const current = metric.values[metric.values.length - 1];
    const delta = current - first;
    const improved = metric.lowerIsBetter ? delta < 0 : delta > 0;
    const deltaText = `${delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(metric.decimals)}${metric.unit ? ` ${metric.unit}` : ""}`;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a metric">
                {METRICS.map((m) => {
                    const selected = m.id === metric.id;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setActiveId(m.id)}
                            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-(--color-accent-dark) focus-visible:outline-none ${selected
                                ? "border-(--color-accent-dark)/60 bg-(--color-accent-dark)/10 text-(--color-accent-dark)"
                                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
                                }`}
                        >
                            {m.label}
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 flex items-baseline gap-3" aria-live="polite">
                <span className="text-4xl font-bold tracking-tighter text-white tabular-nums">
                    {formatValue(metric, current)}
                </span>
                <span
                    className={`text-sm font-semibold tabular-nums ${improved ? "text-emerald-400" : "text-white/50"}`}
                >
                    {deltaText}
                </span>
                <span className="text-xs text-white/40">over 12 weeks</span>
            </div>

            <div
                className="relative mt-4 min-h-28 flex-1"
                role="img"
                aria-label={`${metric.label} over 12 weeks, from ${formatValue(metric, first)} to ${formatValue(metric, current)}`}
            >
                <svg
                    viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full overflow-visible"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={GLOW} stopOpacity="0.28" />
                            <stop offset="100%" stopColor={GLOW} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[0.25, 0.5, 0.75].map((t) => (
                        <line
                            key={t}
                            x1="0"
                            x2={CHART_W}
                            y1={CHART_H * t}
                            y2={CHART_H * t}
                            stroke="rgba(255,255,255,0.05)"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                    <path d={geometry.area} fill={`url(#${gradientId})`} />
                    <motion.path
                        key={metric.id}
                        d={geometry.line}
                        fill="none"
                        stroke={GLOW}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        initial={reduceMotion ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                </svg>
                <span
                    aria-hidden="true"
                    className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-accent-dark) ring-4 ring-(--color-accent-dark)/25"
                    style={{ left: `${geometry.end.x}%`, top: `${geometry.end.y}%` }}
                />
            </div>
        </div>
    );
}

// ! Week
const WEEK: readonly { day: string; done: boolean }[] = [
    { day: "M", done: true },
    { day: "T", done: true },
    { day: "W", done: false },
    { day: "T", done: true },
    { day: "F", done: true },
    { day: "S", done: true },
    { day: "S", done: false },
];

const ConsistencyVisual = memo(function ConsistencyVisual() {
    const completed = WEEK.filter((d) => d.done).length;
    return (
        <div>
            <p className="text-2xl font-semibold text-white tabular-nums">
                {completed} <span className="text-sm font-normal text-white/45">of 7 days</span>
            </p>
            <ul className="sm:mt-1 mt-3 flex gap-1.5" aria-label={`${completed} of 7 days trained this week`}>
                {WEEK.map((d, i) => (
                    <li
                        key={i}
                        className={`flex size-7 items-center justify-center rounded-md text-[10px] font-semibold ${d.done ? "bg-(--color-accent-dark) text-black" : "border border-white/10 text-white/35"
                            }`}
                    >
                        {d.day}
                    </li>
                ))}
            </ul>
        </div>
    );
});


// ! Tags
const TAGS: readonly { label: string; hot?: boolean }[] = [
    { label: "Strength", hot: true },
    { label: "Cardio", hot: true },
    { label: "Push" },
    { label: "Pull" },
    { label: "Legs" },
    // { label: "Compound" },
    // { label: "HIIT" },
];

const TagsVisual = memo(function TagsVisual() {
    return (
        <ul className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
                <li
                    key={t.label}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${t.hot
                        ? "border-(--color-accent-dark)/50 bg-(--color-accent-dark)/10 text-(--color-accent-dark)"
                        : "border-white/10 text-white/50"
                        }`}
                >
                    {t.label}
                </li>
            ))}
        </ul>
    );
});


const ReportsVisual = memo(function ReportsVisual() {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {["PDF", "CSV"].map((format) => (
                    <span
                        key={format}
                        className="rounded-md border border-white/10 bg-white/3 px-2.5 py-1 text-xs font-semibold text-white/70"
                    >
                        {format}
                    </span>
                ))}
                <span className="text-xs text-white/40">Export any time range</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-white/10 px-3 py-2 text-xs">
                <IconBell size={14} className="shrink-0 text-(--color-accent-dark)" aria-hidden="true" />
                <span className="text-white/70">Leg day</span>
                <span className="ml-auto text-white/40 tabular-nums">Mon 6:30 PM</span>
            </div>
        </div>
    );
});


const ITEMS: MagicBentoItem[] = [
    {
        id: "routines",
        colSpan: 4,
        rowSpan: 2,
        content: (
            <CardContent
                icon={<IconListDetails size={18} stroke={1.75} />}
                title="Build routines"
                text="Exercises, sets, reps, weight and notes."
            >
                <RoutineVisual />
            </CardContent>
        ),
    },

    {
        id: "compare",
        colSpan: 2,
        rowSpan: 2,
        content: (
            <CardContent
                icon={<IconTrophy size={18} stroke={1.75} />}
                title="Beat last session"
                text="Every set compared automatically."
            >
                <CompareVisual />
            </CardContent>
        ),
    },

    {
        id: "consistency",
        colSpan: 1,
        content: (
            <CardContent
                icon={<IconFlame size={18} stroke={1.75} />}
                title="Stay consistent"
                text="See your week at a glance."
            >
                <ConsistencyVisual />
            </CardContent>
        ),
    },
      {
        id: "tags",
        colSpan: 1,
        content: (
            <CardContent
                icon={<IconTags size={18} stroke={1.75} />}
                title="Organise your way"
                text="Categories and tags."
            >
                <TagsVisual />
            </CardContent>
        ),
    },
    {
        id: "progress",
        colSpan: 4,
        rowSpan: 2,
        content: (
            <CardContent
                icon={<IconChartLine size={18} stroke={1.75} />}
                title="Watch progress build"
                text="Weight, lifts, measurements and consistency over time."
            >
                <ProgressChart />
            </CardContent>
        ),
    },
  
    {
        id: "reports",
        colSpan: 2,
        content: (
            <CardContent
                icon={<IconFileExport size={18} stroke={1.75} />}
                title="Reports and reminders"
                text="Export data, never skip a session."
            >
                <ReportsVisual />
            </CardContent>
        ),
    },
];

export default function TrainingProgress() {
    return (
        <section className="bg-[#030304] px-4 py-24 sm:px-6 sm:py-32" id="workouts">
            <div className="mx-auto max-w-7xl">
                <SectionEyebrow index="03" text="Training & Progress" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative"
                >
                    { }
                    <h2 className="text-4xl leading-[0.98] font-semibold tracking-tighter text-(--color-text) uppercase [text-shadow:0_2px_16px_rgb(0_0_0/0.9)] min-[400px]:text-5xl sm:text-6xl xl:text-6xl">
                        Log every
                        <span className="text-(--color-text-muted)"> set. </span>
                        See it<span className="text-(--color-accent-dark)"> move.</span>
                    </h2>
                    <p className="mt-6 max-w-md text-sm leading-7 text-(--color-text-muted) sm:text-base">
                        Build routines, log sets in seconds, and watch your lifts, weight and consistency improve over time.
                    </p>
                </motion.div>

                <div className="mt-12">
                    <MagicBento
                        items={ITEMS}
                        columns={6}
                        rowHeight={165}
                        gap={16}
                        radius={16}
                        glowColor={GLOW}
                        enableBorderGlow
                        enableSpotlight
                        spotlightRadius={300}
                        clickEffect
                        enableStars
                        enableTilt={false}
                        enableMagnetism={false}
                        textAutoHide={false}
                        intro
                        style={BENTO_STYLE}
                    />
                </div>
            </div>
        </section>
    );
}