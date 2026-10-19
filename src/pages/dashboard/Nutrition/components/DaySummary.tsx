import { MACRO_CONFIG, MACRO_KEYS } from "@/features/nutrition/nutrition.config";
import type { NutritionTargets, NutritionTotals } from "@/types/nutrition";

type DaySummaryProps = {
    totals: NutritionTotals;
    targets: NutritionTargets;
};

function Bar({ value, target, color }: { value: number; target: number; color?: string }) {
    const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
    return (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
                className="h-full rounded-full bg-(--color-accent) transition-[width] duration-500"
                style={{ width: `${pct}%`, backgroundColor: color }}
            />
        </div>
    );
}

export default function DaySummary({ totals, targets }: DaySummaryProps) {
    const remaining = targets.calories - totals.calories;
    const over = remaining < 0;

    return (
        <section aria-label="Daily summary" className="rounded-sm border border-white/10 bg-white/[0.02] p-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Calories</p>
                    <p className="mt-1 text-3xl font-semibold text-white tabular-nums">
                        {totals.calories.toLocaleString("en")}
                        <span className="ml-1.5 text-sm font-normal text-(--color-text-muted)">
                            / {targets.calories.toLocaleString("en")} kcal
                        </span>
                    </p>
                </div>
                <p className={over ? "text-xs text-red-300" : "text-xs text-(--color-text-muted)"}>
                    {over
                        ? `${Math.abs(remaining).toLocaleString("en")} kcal over target`
                        : `${remaining.toLocaleString("en")} kcal remaining`}
                </p>
            </div>

            <div className="mt-3">
                <Bar value={totals.calories} target={targets.calories} />
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-4">
                {MACRO_KEYS.map((key) => {
                    const { label, color } = MACRO_CONFIG[key];
                    return (
                        <div key={key}>
                            <dt className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{label}</dt>
                            <dd className="mt-1 text-sm font-semibold text-white tabular-nums">
                                {totals.macros[key]}
                                <span className="font-normal text-(--color-text-muted)"> / {targets.macros[key]} g</span>
                            </dd>
                            <div className="mt-2">
                                <Bar value={totals.macros[key]} target={targets.macros[key]} color={color} />
                            </div>
                        </div>
                    );
                })}
            </dl>
        </section>
    );
}