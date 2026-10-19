import type { Icon } from "@tabler/icons-react";
import { IconBarbell, IconFlame, IconRun, IconYoga } from "@tabler/icons-react";
import { timeAgo } from "@/lib/time";
import type { RecentWorkout, WorkoutCategory } from "@/types/dashboard";
import RecentList, { RecentListItem } from "./RecentList";

type RecentWorkoutsProps = {
    data?: RecentWorkout[];
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

const CATEGORY: Record<WorkoutCategory, { label: string; icon: Icon }> = {
    strength: { label: "Strength", icon: IconBarbell },
    cardio: { label: "Cardio", icon: IconRun },
    flexibility: { label: "Flexibility", icon: IconYoga },
    hiit: { label: "HIIT", icon: IconFlame },
};

export default function RecentWorkouts({ data, isLoading, isError, onRetry }: RecentWorkoutsProps) {
    return (
        <RecentList
            title="Recent workouts"
            viewAllTo="/dashboard/workouts"
            items={data}
            getKey={(w) => w.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            emptyTitle="No workouts yet"
            emptyMessage="Your latest sessions will appear here."
            renderItem={(w) => {
                const { label, icon } = CATEGORY[w.category];
                const exercises = `${w.exerciseCount} ${w.exerciseCount === 1 ? "exercise" : "exercises"}`;

                return (
                    <RecentListItem
                        icon={icon}
                        title={w.name}
                        subtitle={`${label} · ${exercises}`}
                        value={`${w.durationMin} min`}
                        meta={timeAgo(w.performedAt)}
                    />
                );
            }}
        />
    );
}