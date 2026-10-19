import { Link } from "react-router-dom";
import ChartCard from "@/components/dashboard/ChartCard";
import { formatDay } from "@/lib/date";
import { convertWeight, weightUnit } from "@/lib/units";
import type { Goal } from "@/types/dashboard";
import type { UnitSystem } from "@/types/profile";

type GoalsProgressProps = {
    data?: Goal[];
    unitSystem: UnitSystem;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};


function getPercent(goal: Goal): number | null {
    const { current, target, startValue } = goal;
    let ratio: number | null;

    if (goal.unit === "kg" && startValue !== undefined) {
        ratio = startValue === target ? 1 : (startValue - current) / (startValue - target);
    } else if (goal.unit === "kg") {
        ratio = null;
    } else {
        ratio = target > 0 ? current / target : 0;
    }

    return ratio === null ? null : Math.min(100, Math.max(0, ratio * 100));
}

function formatAmount(goal: Goal, value: number, unitSystem: UnitSystem) {
    if (goal.unit === "kg") return `${convertWeight(value, unitSystem)} ${weightUnit(unitSystem)}`;
    return `${value} ${goal.unit}`;
}

function GoalRow({ goal, unitSystem }: { goal: Goal; unitSystem: UnitSystem }) {
    const percent = getPercent(goal);

    return (
        <li className="py-3">
            <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-semibold text-white">{goal.title}</p>
                <p className="shrink-0 text-xs text-(--color-text-muted) tabular-nums">
                    {formatAmount(goal, goal.current, unitSystem)} /{" "}
                    {formatAmount(goal, goal.target, unitSystem)}
                </p>
            </div>

            {percent !== null && (
                <div
                    role="progressbar"
                    aria-label={goal.title}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(percent)}
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                >
                    <div
                        className="h-full rounded-full bg-(--color-accent) transition-[width] duration-700 ease-out"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            )}

            {goal.dueDate && (
                <p className="mt-1.5 text-xs text-(--color-text-muted)">
                    Due {formatDay(goal.dueDate)}
                </p>
            )}
        </li>
    );
}

export default function GoalsProgress({
    data,
    unitSystem,
    isLoading,
    isError,
    onRetry,
}: GoalsProgressProps) {
    return (
        <ChartCard
            title="Goals"
            description="Where you are against what you set"
            action={
                <Link
                    to="/dashboard/progress"
                    className="text-[10px] tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    Manage
                </Link>
            }
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            isEmpty={!!data && data.length === 0}
            emptyTitle="No goals set"
            emptyMessage="Set a goal to track your progress here."
            contentClassName="min-h-64"
        >
            <ul className="divide-y divide-white/10">
                {data?.map((goal) => (
                    <GoalRow key={goal.id} goal={goal} unitSystem={unitSystem} />
                ))}
            </ul>
        </ChartCard>
    );
}