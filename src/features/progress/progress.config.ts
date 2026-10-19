import { convertWeight, weightUnit } from "@/lib/units";
import type { UnitSystem } from "@/types/profile";
import {
    PERFORMANCE_METRIC_KEYS,
    type MeasurementKey,
    type PerformanceKind,
    type PerformanceMetricKey,
    type ProgressRange,
} from "@/types/progress";

export const PROGRESS_RANGE_OPTIONS: { value: ProgressRange; label: string }[] = [
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
];

/** Hex values because Recharts needs real colors, not Tailwind classes. */
export const MEASUREMENT_CONFIG: Record<MeasurementKey, { label: string; color: string }> = {
    chest: { label: "Chest", color: "#a78bfa" },
    waist: { label: "Waist", color: "#fbbf24" },
    hips: { label: "Hips", color: "#f472b6" },
    biceps: { label: "Biceps", color: "#34d399" },
    thighs: { label: "Thighs", color: "#fb923c" },
};

export const PERFORMANCE_CONFIG: Record<
    PerformanceMetricKey,
    { label: string; kind: PerformanceKind; better: "higher" | "lower"; color: string }
> = {
    bench_press: { label: "Bench press", kind: "weight", better: "higher", color: "#f87171" },
    squat: { label: "Squat", kind: "weight", better: "higher", color: "#fb923c" },
    deadlift: { label: "Deadlift", kind: "weight", better: "higher", color: "#facc15" },
    run_5k: { label: "5K run", kind: "time", better: "lower", color: "#38bdf8" },
    pull_ups: { label: "Pull-ups", kind: "reps", better: "higher", color: "#4ade80" },
};

export const PERFORMANCE_OPTIONS = PERFORMANCE_METRIC_KEYS.map((value) => ({
    value,
    label: PERFORMANCE_CONFIG[value].label,
}));

/** True when a change in this metric is an improvement (a lower run time, a heavier lift). */
export function isImprovement(metric: PerformanceMetricKey, delta: number): boolean {
    return PERFORMANCE_CONFIG[metric].better === "higher" ? delta > 0 : delta < 0;
}

/* ------------------------- length (stored in cm) ------------------------- */

const CM_PER_INCH = 2.54;
const round1 = (n: number) => Math.round(n * 10) / 10;

export const lengthUnit = (unitSystem: UnitSystem) => (unitSystem === "imperial" ? "in" : "cm");

export const convertLength = (cm: number, unitSystem: UnitSystem) =>
    unitSystem === "imperial" ? round1(cm / CM_PER_INCH) : round1(cm);

export const convertLengthToCm = (value: number, unitSystem: UnitSystem) =>
    unitSystem === "imperial" ? round1(value * CM_PER_INCH) : round1(value);

/* ------------------------- time (stored in seconds) ------------------------- */

const pad2 = (n: number) => String(n).padStart(2, "0");

/** 1470 -> "24:30", 3725 -> "1:02:05" */
export function formatDuration(totalSeconds: number): string {
    const s = Math.round(totalSeconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}:${pad2(m)}:${pad2(sec)}` : `${m}:${pad2(sec)}`;
}

/** "24:30" -> 1470, "1:02:05" -> 3725. Returns null if the text isn't a valid time. */
export function parseDuration(text: string): number | null {
    const parts = text.trim().split(":").map((p) => p.trim());
    if (parts.length < 2 || parts.length > 3) return null;
    if (parts.some((p) => !/^\d+$/.test(p))) return null;

    const numbers = parts.map(Number);
    if (numbers.slice(1).some((n) => n > 59)) return null;

    const seconds = numbers.reduce((total, n) => total * 60 + n, 0);
    return seconds > 0 ? seconds : null;
}

/** One value, shown the way its metric is measured. */
export function formatPerformanceValue(
    metric: PerformanceMetricKey,
    value: number,
    unitSystem: UnitSystem,
): string {
    const { kind } = PERFORMANCE_CONFIG[metric];
    if (kind === "weight") return `${convertWeight(value, unitSystem)} ${weightUnit(unitSystem)}`;
    if (kind === "time") return formatDuration(value);
    return `${value} reps`;
}