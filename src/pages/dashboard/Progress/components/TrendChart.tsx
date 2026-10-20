import { useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { formatShortDate, toISODate } from "@/features/nutrition/nutrition.config";
import {
    convertLength,
    formatDuration,
    lengthUnit,
    MEASUREMENT_CONFIG,
    PERFORMANCE_CONFIG,
} from "@/features/progress/progress.config";
import { convertWeight, weightUnit } from "@/lib/units";
import { cn } from "@/lib/utils";
import type { UnitSystem } from "@/types/profile";
import { MEASUREMENT_KEYS, PERFORMANCE_METRIC_KEYS, type ProgressData } from "@/types/progress";

type TrendChartProps = {
    data: ProgressData;
    unitSystem: UnitSystem;
    
    isFetching: boolean;
};

type Series = {
    id: string;
    group: "Body" | "Performance";
    label: string;
    color: string;
    points: { t: number; value: number }[];
    format: (value: number) => string;
    tick: (value: number) => string;
    goal: number | null;
};

const SELECT =
    "cursor-pointer rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white [color-scheme:dark] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";

function toTime(iso: string): number {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
}

const timeToLabel = (t: number) => formatShortDate(toISODate(new Date(t)));


function buildSeries(data: ProgressData, unitSystem: UnitSystem): Series[] {
    const wUnit = weightUnit(unitSystem);
    const lUnit = lengthUnit(unitSystem);

    const series: Series[] = [
        {
            id: "weight",
            group: "Body",
            label: "Weight",
            color: "#60a5fa",
            points: data.body.flatMap((e) =>
                e.weightKg === null ? [] : [{ t: toTime(e.date), value: convertWeight(e.weightKg, unitSystem) }],
            ),
            format: (v) => `${v} ${wUnit}`,
            tick: (v) => String(v),
            goal: data.goalWeightKg === null ? null : convertWeight(data.goalWeightKg, unitSystem),
        },
    ];

    for (const key of MEASUREMENT_KEYS) {
        series.push({
            id: `body:${key}`,
            group: "Body",
            label: MEASUREMENT_CONFIG[key].label,
            color: MEASUREMENT_CONFIG[key].color,
            points: data.body.flatMap((e) => {
                const cm = e.measurements[key];
                return cm === undefined ? [] : [{ t: toTime(e.date), value: convertLength(cm, unitSystem) }];
            }),
            format: (v) => `${v} ${lUnit}`,
            tick: (v) => String(v),
            goal: null,
        });
    }

    for (const metric of PERFORMANCE_METRIC_KEYS) {
        const { label, kind, color } = PERFORMANCE_CONFIG[metric];
        series.push({
            id: `perf:${metric}`,
            group: "Performance",
            label,
            color,
            points: data.performance
                .filter((e) => e.metric === metric)
                .map((e) => ({
                    t: toTime(e.date),
                    value: kind === "weight" ? convertWeight(e.value, unitSystem) : e.value,
                })),
            format:
                kind === "time"
                    ? formatDuration
                    : kind === "weight"
                      ? (v) => `${v} ${wUnit}`
                      : (v) => `${v} reps`,
            tick: kind === "time" ? formatDuration : (v) => String(v),
            goal: null,
        });
    }

    return series;
}

export default function TrendChart({ data, unitSystem, isFetching }: TrendChartProps) {
    const [selectedId, setSelectedId] = useState("weight");

    const all = buildSeries(data, unitSystem);
    const series = all.find((s) => s.id === selectedId) ?? all[0];
    const groups: Series["group"][] = ["Body", "Performance"];

    return (
        <section aria-label="Trend chart" className="rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm">
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white uppercase">Trends</h2>
                    <p className="mt-1 text-xs text-(--color-text-muted)">Pick anything you track.</p>
                </div>
                <select
                    value={series.id}
                    onChange={(e) => setSelectedId(e.target.value)}
                    aria-label="Metric to chart"
                    className={SELECT}
                >
                    {groups.map((group) => (
                        <optgroup key={group} label={group}>
                            {all
                                .filter((s) => s.group === group)
                                .map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.label}
                                    </option>
                                ))}
                        </optgroup>
                    ))}
                </select>
            </header>

            {series.points.length === 0 ? (
                <div className="flex h-72 items-center justify-center rounded-sm border border-dashed border-white/15 text-xs text-white/40">
                    No {series.label.toLowerCase()} data in this range.
                </div>
            ) : (
                <div
                    className={cn("h-72 w-full transition-opacity", isFetching && "opacity-60")}
                    role="img"
                    aria-label={`Line chart of ${series.label.toLowerCase()} over time`}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={series.points} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                            <XAxis
                                dataKey="t"
                                type="number"
                                scale="time"
                                domain={["dataMin", "dataMax"]}
                                tickFormatter={(t) => timeToLabel(Number(t))}
                                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={32}
                            />
                            <YAxis
                                domain={["auto", "auto"]}
                                width={48}
                                tickFormatter={(v) => series.tick(Number(v))}
                                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ stroke: "rgba(255,255,255,0.2)" }}
                                labelFormatter={(label) => timeToLabel(Number(label))}
                                formatter={(value) => [series.format(Number(value)), series.label]}
                                contentStyle={{
                                    background: "#0a0a0a",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: 2,
                                    fontSize: 12,
                                }}
                                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            {series.goal !== null && (
                                <ReferenceLine
                                    y={series.goal}
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeDasharray="4 4"
                                    ifOverflow="extendDomain"
                                />
                            )}
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={series.color}
                                strokeWidth={2}
                                dot={{ r: 2.5, fill: series.color, strokeWidth: 0 }}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {series.goal !== null && series.points.length > 0 && (
                <p className="mt-1 text-xs text-white/40">Dashed line is your goal weight.</p>
            )}
        </section>
    );
}