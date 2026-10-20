import type { Icon } from "@tabler/icons-react";
import { IconBarbell, IconTarget, IconToolsKitchen2 } from "@tabler/icons-react";
import { timeAgo } from "@/lib/time";
import type { Reminder } from "@/types/dashboard";
import RecentList, { RecentListItem } from "./RecentList";

type RemindersProps = {
    data?: Reminder[];
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

const ICONS: Record<Reminder["kind"], Icon> = {
    workout: IconBarbell,
    meal: IconToolsKitchen2,
    goal: IconTarget,
};

export default function Reminders({ data, isLoading, isError, onRetry }: RemindersProps) {
    const sorted = data
        ? [...data].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
        : undefined;

    return (
        <RecentList
            title="Upcoming reminders"
            viewAllTo="/dashboard/settings"
            items={sorted}
            getKey={(r) => r.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            skeletonRows={3}
            emptyTitle="No reminders"
            emptyMessage="Set reminders for workouts and meals in Settings."
            renderItem={(r) => (
                <RecentListItem icon={ICONS[r.kind]} title={r.title} value={timeAgo(r.at)} />
            )}
        />
    );
}