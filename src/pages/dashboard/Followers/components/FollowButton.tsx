import { useFollowUser, useUnfollowUser } from "@/features/social/useFollow";
import { cn } from "@/lib/utils";
import type { FollowStatus } from "@/types/social";

export default function FollowButton({ userId, status }: { userId: string; status: FollowStatus }) {
    const follow = useFollowUser();
    const unfollow = useUnfollowUser();
    const isPending = follow.isPending || unfollow.isPending;

    const label = status === "accepted" ? "Following" : status === "pending" ? "Requested" : "Follow";

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={() => (status ? unfollow.mutate(userId) : follow.mutate(userId))}
            className={cn(
                "cursor-pointer rounded-sm px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                status
                    ? "border border-white/20 text-white hover:bg-white/10"
                    : "bg-(--color-accent) text-black hover:opacity-90",
            )}
        >
            {label}
        </button>
    );
}