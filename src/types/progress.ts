export const MEASUREMENT_KEYS = ["chest", "waist", "hips", "biceps", "thighs"] as const;
export type MeasurementKey = (typeof MEASUREMENT_KEYS)[number];

/** Always stored in cm. A key is missing when the user didn't measure it that day. */
export type Measurements = Partial<Record<MeasurementKey, number>>;

/** One check-in: weight and/or body measurements for a day. */
export type BodyEntry = {
    id: string;
    /** Local calendar day, YYYY-MM-DD */
    date: string;
    /** Always stored in kg, null if only measurements were logged */
    weightKg: number | null;
    measurements: Measurements;
    notes: string;
    /** ISO date-time */
    createdAt: string;
    /** ISO date-time */
    updatedAt: string;
};

/** What the form sends when logging a check-in. The server fills in the rest. */
export type CreateBodyEntryPayload = {
    date: string;
    weightKg: number | null;
    measurements: Measurements;
    notes: string;
};

export type UpdateBodyEntryPayload = Partial<CreateBodyEntryPayload>;

/**
 * How a metric's value is stored and shown:
 * - weight: kg (converted for display)
 * - time: seconds (shown as mm:ss or h:mm:ss)
 * - reps: a whole number
 */
export type PerformanceKind = "weight" | "time" | "reps";

export const PERFORMANCE_METRIC_KEYS = [
    "bench_press",
    "squat",
    "deadlift",
    "run_5k",
    "pull_ups",
] as const;
export type PerformanceMetricKey = (typeof PERFORMANCE_METRIC_KEYS)[number];

/** One personal-best style record, such as a 5K time or a lifting max. */
export type PerformanceEntry = {
    id: string;
    /** Local calendar day, YYYY-MM-DD */
    date: string;
    metric: PerformanceMetricKey;
    /** kg, seconds or reps, depending on the metric's kind */
    value: number;
    notes: string;
    /** ISO date-time */
    createdAt: string;
    /** ISO date-time */
    updatedAt: string;
};

export type CreatePerformancePayload = {
    date: string;
    metric: PerformanceMetricKey;
    value: number;
    notes: string;
};

export type UpdatePerformancePayload = Partial<CreatePerformancePayload>;

export type ProgressRange = "30d" | "90d" | "1y";

/** Everything the Progress page needs for the selected range. Both lists are oldest first. */
export type ProgressData = {
    range: ProgressRange;
    body: BodyEntry[];
    performance: PerformanceEntry[];
    /** Target weight in kg, null if the user hasn't set one */
    goalWeightKg: number | null;
};

/** Newest value that isn't null. Expects entries oldest first. */
export function latestValue<T>(entries: T[], pick: (entry: T) => number | null | undefined): number | null {
    for (let i = entries.length - 1; i >= 0; i--) {
        const value = pick(entries[i]);
        if (value !== null && value !== undefined) return value;
    }
    return null;
}

/** Newest minus oldest value in the list, or null if fewer than two entries have a value. */
export function changeOverRange<T>(
    entries: T[],
    pick: (entry: T) => number | null | undefined,
): number | null {
    const values = entries
        .map(pick)
        .filter((v): v is number => v !== null && v !== undefined);
    if (values.length < 2) return null;
    return Math.round((values[values.length - 1] - values[0]) * 10) / 10;
}