export const MEASUREMENT_KEYS = ["chest", "waist", "hips", "biceps", "thighs"] as const;
export type MeasurementKey = (typeof MEASUREMENT_KEYS)[number];


export type Measurements = Partial<Record<MeasurementKey, number>>;


export type BodyEntry = {
    id: string;
    
    date: string;
    
    weightKg: number | null;
    measurements: Measurements;
    notes: string;
    
    createdAt: string;
    
    updatedAt: string;
};


export type CreateBodyEntryPayload = {
    date: string;
    weightKg: number | null;
    measurements: Measurements;
    notes: string;
};

export type UpdateBodyEntryPayload = Partial<CreateBodyEntryPayload>;


export type PerformanceKind = "weight" | "time" | "reps";

export const PERFORMANCE_METRIC_KEYS = [
    "bench_press",
    "squat",
    "deadlift",
    "run_5k",
    "pull_ups",
] as const;
export type PerformanceMetricKey = (typeof PERFORMANCE_METRIC_KEYS)[number];


export type PerformanceEntry = {
    id: string;
    
    date: string;
    metric: PerformanceMetricKey;
    
    value: number;
    notes: string;
    
    createdAt: string;
    
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


export type ProgressData = {
    range: ProgressRange;
    body: BodyEntry[];
    performance: PerformanceEntry[];
    
    goalWeightKg: number | null;
};


export function latestValue<T>(entries: T[], pick: (entry: T) => number | null | undefined): number | null {
    for (let i = entries.length - 1; i >= 0; i--) {
        const value = pick(entries[i]);
        if (value !== null && value !== undefined) return value;
    }
    return null;
}


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