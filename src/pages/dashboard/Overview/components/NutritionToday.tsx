import { Link } from "react-router-dom";
import ChartCard from "@/components/dashboard/ChartCard";
import { cn } from "@/lib/utils";
import type { MacroKey, NutritionToday as NutritionTodayData } from "@/types/dashboard";

type NutritionTodayProps = {
    data?: NutritionTodayData;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

/** Config-driven: adding a macro (e.g. fiber) means adding one entry here. */
const MACROS: { key: MacroKey; label: string; barClass: string }[] = [
    { key: "protein", label: "Protein", barClass: "bg-(--color-accent)" },
    { key: "carbs", label: "Carbs", barClass: "bg-white/70" },
    { key: "fat", label: "Fat", barClass: "bg-white/35" },
];

const RING_SIZE = 120;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const toPercent = (value: number, target: number) =>
    target > 0 ? Math.min(100, Math.max(0, (value / target) * 100)) : 0;

function CalorieRing({ calories, target }: { calories: number; target: number }) {
    const percent = toPercent(calories, target);
    const remaining = target - calories;
    const isOver = remaining < 0;
    const offset = RING_CIRCUMFERENCE * (1 - percent / 100);

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                role="progressbar"
                aria-label="Calories today"
                aria-valuemin={0}
                aria-valuemax={target}
                aria-valuenow={calories}
                className="relative size-36"
            >
                <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="size-full -rotate-90">
                    <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={RING_STROKE}
                    />
                    <circle
                        cx={RING_SIZE / 2}
                        cy={RING_SIZE / 2}
                        r={RING_RADIUS}
                        fill="none"
                        stroke={isOver ? "#f87171" : "var(--color-accent)"}
                        strokeWidth={RING_STROKE}
                        strokeLinecap="round"
                        strokeDasharray={RING_CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        className="transition-[stroke-dashoffset] duration-700 ease-out"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold text-white tabular-nums">
                        {calories.toLocaleString("en")}
                    </span>
                    <span className="text-[10px] tracking-[0.15em] text-(--color-text-muted) uppercase">
                        / {target.toLocaleString("en")} kcal
                    </span>
                </div>
            </div>

            <p className={cn("text-xs", isOver ? "text-red-400" : "text-(--color-text-muted)")}>
                {isOver
                    ? `${Math.abs(remaining).toLocaleString("en")} kcal over target`
                    : `${remaining.toLocaleString("en")} kcal remaining`}
            </p>
        </div>
    );
}

function MacroBar({
    label,
    value,
    target,
    barClass,
}: {
    label: string;
    value: number;
    target: number;
    barClass: string;
}) {
    const percent = toPercent(value, target);

    return (
        <div>
            <div className="flex items-baseline justify-between text-xs">
                <span className="tracking-[0.15em] text-white/70 uppercase">{label}</span>
                <span className="text-(--color-text-muted) tabular-nums">
                    <span className="font-semibold text-white">{Math.round(value)}</span> /{" "}
                    {Math.round(target)} g
                </span>
            </div>
            <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={target}
                aria-valuenow={Math.round(value)}
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
            >
                <div
                    className={cn("h-full rounded-full transition-[width] duration-700 ease-out", barClass)}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

export default function NutritionToday({ data, isLoading, isError, onRetry }: NutritionTodayProps) {
    const isEmpty =
        !!data &&
        data.calories === 0 &&
        MACROS.every(({ key }) => data.macros[key] === 0);

    return (
        <ChartCard
            title="Nutrition today"
            description="Calories and macros against your targets"
            action={
                <Link
                    to="/dashboard/nutrition"
                    className="text-[10px] tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    Log meal
                </Link>
            }
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            isEmpty={isEmpty}
            emptyTitle="No meals logged today"
            emptyMessage="Log your first meal to see calories and macros."
            contentClassName="min-h-64"
        >
            {data && (
                <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                    <CalorieRing calories={data.calories} target={data.caloriesTarget} />

                    <div className="w-full flex-1 space-y-5">
                        {MACROS.map(({ key, label, barClass }) => (
                            <MacroBar
                                key={key}
                                label={label}
                                value={data.macros[key]}
                                target={data.macroTargets[key]}
                                barClass={barClass}
                            />
                        ))}
                    </div>
                </div>
            )}
        </ChartCard>
    );
}