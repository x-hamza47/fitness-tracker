import { useState } from "react";
import { StatCardSkeleton } from "@/components/dashboard/StatCard";
import StatCard from "@/components/dashboard/StatCard";
import { buildStatCards } from "@/features/dashboard/overview.config";
import { useOverview } from "@/features/dashboard/useOverview";
import { useProfile } from "@/features/profile/useProfile";
import { useUiStore } from "@/stores/uiStore";
import type { DateRange } from "@/types/dashboard";
import ActivityFeed from "./components/ActivityFeed";
import GoalsProgress from "./components/GoalsProgress";
import NutritionToday from "./components/NutritionToday";
import OverviewHeader from "./components/OverviewHeader";
import ProgressTrend from "./components/ProgressTrend";
import RecentMeals from "./components/RecentMeals";
import RecentWorkouts from "./components/RecentWorkouts";
import Reminders from "./components/Reminders";
import WorkoutActivity from "./components/WorkoutActivity";

export default function Overview() {
    const [range, setRange] = useState<DateRange>("30d");
    const unitSystem = useUiStore((s) => s.unitSystem);
    const { profile } = useProfile();
    const { data, isLoading, isRefetching, isError, refetch } = useOverview(range);

    // Shared by every widget, so each one can show loading and error on its own
    const state = { isLoading, isError, onRetry: refetch };

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <OverviewHeader name={profile?.name} />

            <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {data
                    ? buildStatCards(data.summary, unitSystem).map(({ id, ...card }) => (
                          <StatCard key={id} {...card} />
                      ))
                    : isLoading && Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)}
            </section>

            {/* *:h-full makes each card fill its grid cell, so rows line up */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="min-w-0 *:h-full lg:col-span-2">
                    <WorkoutActivity
                        data={data?.workoutActivity}
                        range={range}
                        onRangeChange={setRange}
                        isRefetching={isRefetching}
                        {...state}
                    />
                </div>
                <div className="min-w-0 *:h-full">
                    <NutritionToday data={data?.nutritionToday} {...state} />
                </div>

                <div className="min-w-0 *:h-full lg:col-span-2">
                    <ProgressTrend
                        data={data?.progressTrend}
                        unitSystem={unitSystem}
                        isRefetching={isRefetching}
                        {...state}
                    />
                </div>
                <div className="min-w-0 *:h-full">
                    <GoalsProgress data={data?.goals} unitSystem={unitSystem} {...state} />
                </div>

                <div className="min-w-0 *:h-full lg:col-span-1">
                    <RecentWorkouts data={data?.recentWorkouts} {...state} />
                </div>
                <div className="min-w-0 *:h-full lg:col-span-1">
                    <RecentMeals data={data?.recentMeals} {...state} />
                </div>
                <div className="min-w-0 *:h-full lg:col-span-1">
                    <Reminders data={data?.reminders} {...state} />
                </div>

                <div className="min-w-0 *:h-full lg:col-span-3">
                    <ActivityFeed data={data?.activity} {...state} />
                </div>
            </div>
        </div>
    );
}