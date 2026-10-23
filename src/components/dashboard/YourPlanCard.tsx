import { Link } from "react-router-dom";
import {
    IconAlertCircle,
    IconBarbell,
    IconCheck,
    IconDroplet,
    IconFlame,
    IconTarget,
} from "@tabler/icons-react";
import { useNutritionPlan } from "@/features/nutrition/useNutrition";

type YourPlanCardProps = {
    className?: string;
};

export default function YourPlanCard({ className }: YourPlanCardProps) {
    const { plan, isLoading } = useNutritionPlan();

    if (isLoading) {
        return (
            <div className="h-64 animate-pulse rounded-sm border border-white/10 bg-white/2" />
        );
    }

    if (!plan) return null;

    const hasMissing = plan.missingFields && plan.missingFields.length > 0;

    return (
        <section
            aria-label="Your personalized plan"
            className={`rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm ${className ?? ""}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">
                        Your Personalized Plan
                    </h2>
                    <p className="mt-1 text-xs text-(--color-text-muted)">
                        Science-backed targets tailored to your profile and goals.
                    </p>
                </div>
                <Link
                    to="/dashboard/profile"
                    className="text-[10px] tracking-[0.15em] text-(--color-accent) uppercase transition-opacity hover:opacity-80"
                >
                    Edit profile →
                </Link>
            </div>

            {hasMissing && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-sm border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <IconAlertCircle size={18} className="shrink-0 text-amber-400" />
                        <span className="truncate">
                            Complete your profile to get 100% personalized targets (missing:{" "}
                            {plan.missingFields.join(", ")}).
                        </span>
                    </div>
                    <Link
                        to="/dashboard/profile"
                        className="shrink-0 font-semibold underline underline-offset-4 hover:text-white"
                    >
                        Complete now
                    </Link>
                </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-sm border border-white/5 bg-white/2 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
                        <IconFlame size={14} className="text-amber-400" />
                        <span>Daily Calorie Target</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-white tabular-nums">
                        {plan.calories.toLocaleString()} <span className="text-xs font-normal text-white/50">kcal</span>
                    </p>
                    <p className="text-[11px] text-(--color-text-muted)">
                        P: {plan.macros.protein}g · C: {plan.macros.carbs}g · F: {plan.macros.fat}g
                    </p>
                </div>

                <div className="rounded-sm border border-white/5 bg-white/2 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
                        <IconDroplet size={14} className="text-cyan-400" />
                        <span>Daily Hydration</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-white tabular-nums">
                        {plan.waterLiters} <span className="text-xs font-normal text-white/50">L</span>
                    </p>
                    <p className="text-[11px] text-(--color-text-muted)">
                        ~{plan.waterMl.toLocaleString()} ml / day
                    </p>
                </div>

                <div className="rounded-sm border border-white/5 bg-white/2 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
                        <IconBarbell size={14} className="text-(--color-accent)" />
                        <span>Workouts / Week</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-white tabular-nums">
                        {plan.recommendedWorkoutsPerWeek} <span className="text-xs font-normal text-white/50">sessions</span>
                    </p>
                    <p className="text-[11px] text-(--color-text-muted) truncate">
                        {plan.recommendedCategories.join(", ")}
                    </p>
                </div>

                <div className="rounded-sm border border-white/5 bg-white/2 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
                        <IconTarget size={14} className="text-emerald-400" />
                        <span>Weekly Pace</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-white tabular-nums">
                        {plan.estimatedWeeklyWeightChange > 0 ? "+" : ""}
                        {plan.estimatedWeeklyWeightChange} <span className="text-xs font-normal text-white/50">kg/wk</span>
                    </p>
                    <p className="text-[11px] text-(--color-text-muted) truncate">
                        {plan.estimatedTargetDate ? `Target: ${plan.estimatedTargetDate}` : "Steady pace"}
                    </p>
                </div>
            </div>

            {plan.tips && plan.tips.length > 0 && (
                <div className="mt-4 rounded-sm border border-white/5 bg-white/2 p-3.5">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase">
                        Action tips for this week
                    </p>
                    <ul className="mt-2.5 space-y-1.5">
                        {plan.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                                <IconCheck size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
