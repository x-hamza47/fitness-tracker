import type { Icon } from "@tabler/icons-react";
import { IconBarbell, IconMessageCircle, IconTrophy, IconUserPlus } from "@tabler/icons-react";
import { timeAgo } from "@/lib/time";
import type { ActivityItem, ActivityType } from "@/types/dashboard";
import RecentList, { RecentListItem } from "./RecentList";

type ActivityFeedProps = {
    data?: ActivityItem[];
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

const ICONS: Record<ActivityType, Icon> = {
    workout_completed: IconBarbell,
    goal_achieved: IconTrophy,
    new_follower: IconUserPlus,
    forum_reply: IconMessageCircle,
};

export default function ActivityFeed({ data, isLoading, isError, onRetry }: ActivityFeedProps) {
    return (
        <RecentList
            title="Activity"
            viewAllTo="/dashboard/notifications"
            items={data}
            getKey={(a) => a.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            emptyTitle="All quiet"
            emptyMessage="New followers, goals and replies will show up here."
            renderItem={(a) => (
                <RecentListItem
                    icon={ICONS[a.type]}
                    title={a.message}
                    meta={`${a.read ? "" : "New · "}${timeAgo(a.createdAt)}`}
                />
            )}
        />
    );
}