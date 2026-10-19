import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "@/components/dashboard/ChartCard";
import RangeTabs from "@/components/dashboard/RangeTabs";
import { DATE_RANGES, type DateRange, type WorkoutActivityPoint } from "@/types/dashboard";
import { formatDay, parseISODate } from "@/lib/date";


type WorkoutActivityProps = {
    data?: WorkoutActivityPoint[];
    range: DateRange;
    onRangeChange: (range: DateRange) => void;
    isLoading?: boolean;
    isRefetching?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

type ChartPoint = {
    /** X axis text */
    label: string;
    /** Tooltip title */
    title: string;
    workouts: number;
    minutes: number;
};



const formatWeekday = (iso: string) =>
    parseISODate(iso).toLocaleDateString("en", { weekday: "short" });

/** 90D would be 90 thin bars, so group it into weeks. The newest week is always full. */
function groupByWeek(points: WorkoutActivityPoint[]): ChartPoint[] {
    const weeks: ChartPoint[] = [];

    for (let end = points.length; end > 0; end -= 7) {
        const chunk = points.slice(Math.max(0, end - 7), end);
        weeks.push({
            label: formatDay(chunk[0].date),
            title: `Week of ${formatDay(chunk[0].date)}`,
            workouts: chunk.reduce((sum, p) => sum + p.workouts, 0),
            minutes: chunk.reduce((sum, p) => sum + p.minutes, 0),
        });
    }

    return weeks.reverse();
}

function toChartData(points: WorkoutActivityPoint[], range: DateRange): ChartPoint[] {
    if (range === "90d") return groupByWeek(points);

    return points.map((p) => ({
        label: range === "7d" ? formatWeekday(p.date) : formatDay(p.date),
        title: formatDay(p.date),
        workouts: p.workouts,
        minutes: p.minutes,
    }));
}

function Summary({ workouts, minutes }: { workouts: number; minutes: number }) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    return (
        <dl className="mb-4 flex gap-8">
            <div>
                <dt className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Workouts</dt>
                <dd className="mt-1 text-2xl font-semibold text-white tabular-nums">{workouts}</dd>
            </div>
            <div>
                <dt className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Time trained</dt>
                <dd className="mt-1 text-2xl font-semibold text-white tabular-nums">
                    {hours}
                    <span className="text-sm text-(--color-text-muted)">h </span>
                    {rest}
                    <span className="text-sm text-(--color-text-muted)">m</span>
                </dd>
            </div>
        </dl>
    );
}

export default function WorkoutActivity({
    data,
    range,
    onRangeChange,
    isLoading,
    isRefetching,
    isError,
    onRetry,
}: WorkoutActivityProps) {
    const chartData = data ? toChartData(data, range) : [];
    const totalWorkouts = chartData.reduce((sum, p) => sum + p.workouts, 0);
    const totalMinutes = chartData.reduce((sum, p) => sum + p.minutes, 0);

    return (
        <ChartCard
            title="Workout activity"
            description={range === "90d" ? "Workouts per week" : "Workouts per day"}
            action={
                <RangeTabs
                    label="Date range"
                    options={DATE_RANGES}
                    value={range}
                    onChange={onRangeChange}
                />
            }
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
            onRetry={onRetry}
            isEmpty={!!data && totalWorkouts === 0}
            emptyTitle="No workouts in this period"
            emptyMessage="Log a workout and it will show up here."
        >
            <Summary workouts={totalWorkouts} minutes={totalMinutes} />

            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                            interval="preserveStartEnd"
                            minTickGap={16}
                        />
                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            contentStyle={{
                                background: "#0b0b0d",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: 2,
                                fontSize: 12,
                            }}
                            labelStyle={{ color: "#fff", marginBottom: 4 }}
                            itemStyle={{ color: "rgba(255,255,255,0.7)" }}
                            labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ""}
                            formatter={(value, _name, item) => [
                                `${value} (${item.payload.minutes} min)`,
                                "Workouts",
                            ]}
                        />
                        <Bar
                            dataKey="workouts"
                            fill="var(--color-accent)"
                            radius={[2, 2, 0, 0]}
                            maxBarSize={28}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    );
}