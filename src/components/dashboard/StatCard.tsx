import type { ReactNode } from "react";
import type { Icon } from "@tabler/icons-react";
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import type { TrendDirection } from "@/types/dashboard";

export type StatTone = "positive" | "negative" | "neutral";

type StatCardProps = {
    label: string;
    value: ReactNode;
    unit?: string;
    icon: Icon;
    trend?: {
        direction: TrendDirection;
        label: string;
        tone?: StatTone;
    };
    progress?: number;
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

// Users who turned off animations in their OS get no tilt and no floating
// const NO_MOTION = "motion-reduce:transform-none!";

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
        <CardContainer
            containerClassName={cn("h-full w-full min-w-0 py-0 items-stretch", className)}
            className="h-full w-full items-stretch"
        >
            <CardBody className="group relative flex h-full w-full flex-col rounded-2xl border border-white/15 p-5 ">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl bg-linear-to-br from-white/12 via-white/5 to-white/2 backdrop-blur-sm"
                >
                    <div className="absolute -top-10 -right-10 size-32 rounded-full bg-(--color-accent)/20 opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden" />
                </div>

                <div className="flex items-center justify-between">
                    <CardItem translateZ={30}>
                        <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">{label}</p>
                    </CardItem>
                    <CardItem translateZ={70}>
                        <span className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-(--color-accent)">
                            <IconComponent size={18} stroke={1.5} aria-hidden="true" />
                        </span>
                    </CardItem>
                </div>

                <CardItem translateZ={80} className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight text-white tabular-nums ">
                        {value}
                    </span>
                    {unit && <span className="text-sm text-white/50">{unit}</span>}
                </CardItem>

                {trend && TrendIcon && (
                    <CardItem
                        translateZ={40}
                        className={cn("mt-3 flex items-center gap-1 text-xs", TONE_CLASSES[trend.tone ?? "neutral"])}
                    >
                        <TrendIcon size={14} stroke={2} aria-hidden="true" />
                        {trend.label}
                    </CardItem>
                )}

                {clamped !== null && (
                    <CardItem
                        translateZ={35}
                        role="progressbar"
                        aria-label={label}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(clamped)}
                        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/30"
                    >
                        <div
                            className="h-full rounded-full bg-linear-to-r from-(--color-accent-dark) to-(--color-accent) shadow-[0_0_12px_rgb(255_106_0/0.7)] transition-[width] duration-700 ease-out"
                            style={{ width: `${clamped}%` }}
                        />
                    </CardItem>
                )}

                {hint && (
                    <CardItem translateZ={25} className="mt-auto pt-3 text-xs text-white/50">
                        {hint}
                    </CardItem>
                )}
            </CardBody>
        </CardContainer>
    );
}

export function StatCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
            <div className="h-2.5 w-20 rounded bg-white/10" />
            <div className="mt-6 h-9 w-28 rounded bg-white/10" />
            <div className="mt-3 h-2.5 w-16 rounded bg-white/10" />
            <div className="mt-4 h-1.5 w-full rounded-full bg-white/10" />
        </div>
    );
}