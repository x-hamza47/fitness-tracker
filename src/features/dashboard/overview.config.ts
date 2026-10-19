import type { ComponentProps } from "react";
import { IconBarbell, IconCalendarStats, IconFlame, IconScale } from "@tabler/icons-react";
import type StatCard from "@/components/dashboard/StatCard";
import { convertWeight, weightUnit } from "@/lib/units";
import type { OverviewSummary } from "@/types/dashboard";
import type { UnitSystem } from "@/types/profile";

export type StatCardConfig = ComponentProps<typeof StatCard> & { id: string };

const percent = (value: number, target: number) => (target > 0 ? (value / target) * 100 : 0);

export function buildStatCards(summary: OverviewSummary, unitSystem: UnitSystem): StatCardConfig[] {
    const unit = weightUnit(unitSystem);
    const weightChange = convertWeight(summary.weightChangeKg, unitSystem);
    const direction = weightChange > 0 ? "up" : weightChange < 0 ? "down" : "flat";

    return [
        {
            id: "workouts",
            label: "Workouts this week",
            icon: IconBarbell,
            value: summary.workoutsThisWeek,
            unit: `/ ${summary.workoutsWeeklyGoal}`,
            progress: percent(summary.workoutsThisWeek, summary.workoutsWeeklyGoal),
        },
        {
            id: "calories",
            label: "Calories today",
            icon: IconFlame,
            value: summary.caloriesToday.toLocaleString("en"),
            unit: "kcal",
            progress: percent(summary.caloriesToday, summary.caloriesTarget),
            hint: `Target ${summary.caloriesTarget.toLocaleString("en")} kcal`,
        },
        {
            id: "weight",
            label: "Current weight",
            icon: IconScale,
            value: convertWeight(summary.currentWeightKg, unitSystem),
            unit,
            // Tone stays neutral: whether losing or gaining is good depends on the user's goal
            trend: {
                direction,
                label: `${weightChange > 0 ? "+" : ""}${weightChange} ${unit} in this period`,
            },
        },
        {
            id: "streak",
            label: "Workout streak",
            icon: IconCalendarStats,
            value: summary.streakDays,
            unit: summary.streakDays === 1 ? "day" : "days",
            hint: `Best: ${summary.bestStreakDays} days`,
        },
    ];
}