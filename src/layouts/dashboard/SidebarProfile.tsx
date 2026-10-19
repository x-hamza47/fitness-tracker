import { Link } from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useProfile } from "@/features/profile/useProfile";
import { FOLLOWERS_PATH, PROFILE_PATH } from "./navigation";

type SidebarProfileProps = {
    /** Icon-only rail: shows just the avatar */
    collapsed?: boolean;
    /** Called after a link is clicked, used by the mobile drawer to close itself */
    onNavigate?: () => void;
};

function formatCount(value: number): string {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

function Stat({
    value,
    label,
    to,
    onNavigate,
}: {
    value: number;
    label: string;
    to: string;
    onNavigate?: () => void;
}) {
    return (
        <Link
            to={to}
            onClick={onNavigate}
            className="rounded-sm text-xs text-(--color-text-muted) transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
            <span className="font-semibold text-white">{formatCount(value)}</span> {label}
        </Link>
    );
}

function SidebarProfileSkeleton({ collapsed }: { collapsed: boolean }) {
    return (
        <div
            aria-hidden="true"
            className={cn("animate-pulse", collapsed && "flex justify-center")}
        >
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                <div className="size-12 shrink-0 rounded-full bg-white/10" />
                {!collapsed && (
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 rounded bg-white/10" />
                        <div className="h-2.5 w-16 rounded bg-white/10" />
                    </div>
                )}
            </div>
            {!collapsed && <div className="mt-3 h-3 w-32 rounded bg-white/10" />}
        </div>
    );
}

export default function SidebarProfile({
    collapsed = false,
    onNavigate,
}: SidebarProfileProps) {
    const { profile, isLoading, isError, refetch } = useProfile();

    if (isLoading) return <SidebarProfileSkeleton collapsed={collapsed} />;

    if (isError || !profile) {
        return (
            <button
                type="button"
                onClick={() => refetch()}
                className="w-full cursor-pointer text-left text-xs text-(--color-text-muted) transition-colors hover:text-white"
            >
                {collapsed ? "Retry" : "Couldn't load your profile. Tap to retry."}
            </button>
        );
    }

    if (collapsed) {
        return (
            <Link
                to={PROFILE_PATH}
                title={profile.name}
                aria-label={`View profile of ${profile.name}`}
                className="flex justify-center rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
                <Avatar name={profile.name} src={profile.avatarUrl} size="md" ring />
            </Link>
        );
    }

    return (
        <div>
            <Link
                to={PROFILE_PATH}
                onClick={onNavigate}
                aria-label={`View profile of ${profile.name}`}
                className="-mx-2 flex items-center gap-3 rounded-sm px-2 py-2 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
                <Avatar name={profile.name} src={profile.avatarUrl} size="lg" ring />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{profile.name}</p>
                    <p className="truncate text-xs text-(--color-text-muted)">
                        @{profile.username}
                    </p>
                </div>
            </Link>

            <div className="mt-2 flex items-center gap-4 px-0.5">
                <Stat
                    value={profile.stats.followers}
                    label="Followers"
                    to={FOLLOWERS_PATH}
                    onNavigate={onNavigate}
                />
                <Stat
                    value={profile.stats.following}
                    label="Following"
                    to={FOLLOWERS_PATH}
                    onNavigate={onNavigate}
                />
            </div>
        </div>
    );
}