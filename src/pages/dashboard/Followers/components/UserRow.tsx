import type { ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import type { UserSummary } from "@/types/social";

export default function UserRow({ user, action }: { user: UserSummary; action?: ReactNode }) {
    return (
        <li className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
                <Avatar name={user.name} src={user.profilePicture} size="md" />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                    <p className="truncate text-xs text-(--color-text-muted)">@{user.username}</p>
                </div>
            </div>
            <div className="flex shrink-0 gap-2">{action}</div>
        </li>
    );
}