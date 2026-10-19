import type { ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { TrendDirection } from "@/types/dashboard";

/**
 * Direction and tone are separate on purpose:
 * weight going "down" is good, calories going "up" past target may be bad.
 */
export type StatTone = "positive" | "negative" | "neutral";

type StatCardProps = {
    label: string;
    /** A string, a number, or a <CountUp /> element */
    value: ReactNode;
    /** Small text next to the value, e.g. "kg", "/ 5", "kcal" */
    unit?: string;
    icon: Icon;
    /** Optional change indicator, e.g. "-0.8 kg" */
    trend?: {
        direction: TrendDirection;
        label: string;
        tone?: StatTone;
    };
    /** 0 to 100, shows a thin progress bar when provided */
    progress?: number;
    /** Small helper line at the bottom, e.g. "Best: 14 days" */
    hint?: string;
    className?: string;
};

const TREND_ICONS: Record<TrendDirection, Icon> = {
    up: IconArrowUpRight,
    down: IconArrowDownRight,
    flat: IconMinus,
};

const TONE_CLASSES: Record<StatTone, string> = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-white/50",
};

export default function StatCard({
    label,
    value,
    unit,
    icon: IconComponent,
    trend,
    progress,
    hint,
    className,
}: StatCardProps) {
    const TrendIcon = trend ? TREND_ICONS[trend.direction] : null;
    const clamped = progress === undefined ? null : Math.min(100, Math.max(0, progress));

    return (
        <div
            className={cn(
                "flex flex-col rounded-sm border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20",
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase">{label}</p>
                <IconComponent size={18} stroke={1.5} className="text-white/30" aria-hidden="true" />
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tabular-nums text-white">{value}</span>
                {unit && <span className="text-sm text-(--color-text-muted)">{unit}</span>}
            </div>

            {trend && TrendIcon && (
                <p
                    className={cn(
                        "mt-2 flex items-center gap-1 text-xs",
                        TONE_CLASSES[trend.tone ?? "neutral"],
                    )}
                >
                    <TrendIcon size={14} stroke={2} aria-hidden="true" />
                    {trend.label}
                </p>
            )}

            {clamped !== null && (
                <div
                    role="progressbar"
                    aria-label={label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(clamped)}
                    className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10"
                >
                    <div
                        className="h-full rounded-full bg-(--color-accent) transition-[width] duration-500 ease-out"
                        style={{ width: `${clamped}%` }}
                    />
                </div>
            )}

            {hint && <p className="mt-3 text-xs text-(--color-text-muted)">{hint}</p>}
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="animate-pulse rounded-sm border border-white/10 bg-white/[0.02] p-5"
        >
            <div className="h-2.5 w-20 rounded bg-white/10" />
            <div className="mt-5 h-8 w-24 rounded bg-white/10" />
            <div className="mt-3 h-2.5 w-16 rounded bg-white/10" />
            <div className="mt-4 h-1 w-full rounded-full bg-white/10" />
        </div>
    );
}