import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import ChartCard from "@/components/dashboard/ChartCard";
import { formatDay } from "@/lib/date";
import { convertWeight, weightUnit } from "@/lib/units";
import type { ProgressPoint } from "@/types/dashboard";
import type { UnitSystem } from "@/types/profile";

type ProgressTrendProps = {
    data?: ProgressPoint[];
    unitSystem: UnitSystem;
    isLoading?: boolean;
    isRefetching?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

const TICK = { fill: "rgba(255,255,255,0.5)", fontSize: 11 };

export default function ProgressTrend({
    data,
    unitSystem,
    isLoading,
    isRefetching,
    isError,
    onRetry,
}: ProgressTrendProps) {
    const unit = weightUnit(unitSystem);

    const chartData = (data ?? []).map((p) => ({
        label: formatDay(p.date),
        weight: convertWeight(p.weightKg, unitSystem),
    }));

    const first = chartData[0]?.weight;
    const last = chartData[chartData.length - 1]?.weight;
    const change = first !== undefined && last !== undefined ? Math.round((last - first) * 10) / 10 : 0;

    return (
        <ChartCard
            title="Weight trend"
            description={
                chartData.length > 0
                    ? `${change > 0 ? "+" : ""}${change} ${unit} over this period`
                    : "Your body weight over time"
            }
            action={
                <Link
                    to="/dashboard/progress"
                    className="text-[10px] tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    Add entry
                </Link>
            }
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
            onRetry={onRetry}
            isEmpty={!!data && data.length === 0}
            emptyTitle="No progress recorded"
            emptyMessage="Add your weight to start tracking your trend."
            contentClassName="h-64"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tick={TICK}
                        interval="preserveStartEnd"
                        minTickGap={32}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={TICK}
                        domain={[(min: number) => Math.floor(min - 1), (max: number) => Math.ceil(max + 1)]}
                    />
                    <Tooltip
                        cursor={{ stroke: "rgba(255,255,255,0.2)" }}
                        contentStyle={{
                            background: "#0b0b0d",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 2,
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "#fff", marginBottom: 4 }}
                        itemStyle={{ color: "rgba(255,255,255,0.7)" }}
                        formatter={(value) => [`${Number(value)} ${unit}`, "Weight"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}