import {
    Bar,
    BarChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import RangeTabs from "@/components/dashboard/RangeTabs";
import {
    formatShortDate,
    MACRO_CONFIG,
    MACRO_KEYS,
    NUTRITION_RANGE_OPTIONS,
} from "@/features/nutrition/nutrition.config";
import type { NutritionAnalytics as NutritionAnalyticsData, NutritionRange } from "@/types/nutrition";

type NutritionAnalyticsProps = {
    analytics: NutritionAnalyticsData | null;
    range: NutritionRange;
    onRangeChange: (range: NutritionRange) => void;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div>
            <dt className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{label}</dt>
            <dd className="mt-1 text-xl font-semibold text-white tabular-nums">{value}</dd>
            {hint && <p className="text-xs text-(--color-text-muted)">{hint}</p>}
        </div>
    );
}

export default function NutritionAnalytics({
    analytics,
    range,
    onRangeChange,
    isLoading,
    isError,
    onRetry,
}: NutritionAnalyticsProps) {
    let body;

    if (isLoading && !analytics) {
        body = <div aria-hidden="true" className="h-72 animate-pulse rounded-sm bg-white/5" />;
    } else if (isError || !analytics) {
        body = (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-xs text-(--color-text-muted)">Couldn't load your nutrition analytics.</p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="cursor-pointer rounded-sm border border-white/20 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    Try again
                </button>
            </div>
        );
    } else {
        const { averages, targets, trend, loggedDays } = analytics;

        const kcalFromMacros = MACRO_KEYS.map((key) => ({
            key,
            kcal: averages.macros[key] * MACRO_CONFIG[key].kcalPerGram,
        }));
        const kcalTotal = kcalFromMacros.reduce((sum, m) => sum + m.kcal, 0);
        const split = kcalFromMacros.map((m) => ({
            ...m,
            pct: kcalTotal > 0 ? Math.round((m.kcal / kcalTotal) * 100) : 0,
        }));

        body = (
            <>
                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Stat
                        label="Avg calories"
                        value={`${averages.calories.toLocaleString("en")}`}
                        hint={`target ${targets.calories.toLocaleString("en")}`}
                    />
                    <Stat label="Avg protein" value={`${averages.macros.protein} g`} hint={`target ${targets.macros.protein} g`} />
                    <Stat label="Avg carbs" value={`${averages.macros.carbs} g`} hint={`target ${targets.macros.carbs} g`} />
                    <Stat label="Days logged" value={`${loggedDays}`} hint={`of ${trend.length}`} />
                </dl>

                <div className="mt-6">
                    <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Daily calories</p>
                    <div
                        className="mt-3 h-64 w-full"
                        role="img"
                        aria-label={`Bar chart of daily calories over the last ${trend.length} days`}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatShortDate}
                                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                    minTickGap={28}
                                />
                                <YAxis
                                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                    labelFormatter={(label) => formatShortDate(String(label))}
                                    formatter={(value) => [`${value} kcal`, "Calories"]}
                                    contentStyle={{
                                        background: "#0a0a0a",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: 2,
                                        fontSize: 12,
                                    }}
                                    labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <ReferenceLine
                                    y={targets.calories}
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeDasharray="4 4"
                                />
                                <Bar dataKey="calories" fill="var(--color-accent)" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-1 text-xs text-white/40">Dashed line is your daily target.</p>
                </div>

                <div className="mt-6">
                    <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Macro split (share of calories)</p>
                    <div
                        className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-white/10"
                        role="img"
                        aria-label={split.map((s) => `${MACRO_CONFIG[s.key].label} ${s.pct}%`).join(", ")}
                    >
                        {split.map((s) => (
                            <div
                                key={s.key}
                                style={{ width: `${s.pct}%`, backgroundColor: MACRO_CONFIG[s.key].color }}
                            />
                        ))}
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                        {split.map((s) => (
                            <li key={s.key} className="flex items-center gap-2 text-xs text-white/70">
                                <span
                                    aria-hidden="true"
                                    className="size-2 rounded-full"
                                    style={{ backgroundColor: MACRO_CONFIG[s.key].color }}
                                />
                                {MACRO_CONFIG[s.key].label}
                                <span className="text-white/40 tabular-nums">{s.pct}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    }

    return (
        <section aria-label="Nutrition analytics" className="rounded-sm border border-white/10 bg-white/[0.02] p-5">
            <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white uppercase">Analytics</h2>
                    <p className="mt-1 text-xs text-(--color-text-muted)">Averages count only days you logged.</p>
                </div>
                <RangeTabs label="Range" options={NUTRITION_RANGE_OPTIONS} value={range} onChange={onRangeChange} />
            </header>
            {body}
        </section>
    );
}