import type { ReactNode } from "react";
import Avatar from "@/components/ui/Avatar";
import type { UserSummary } from "@/types/social";

export default function UserRow({
    user,
    action,
    onSelect,
}: {
    user: UserSummary;
    action?: ReactNode;
    onSelect?: () => void;
}) {
    return (
        <li className="flex items-center justify-between gap-3 py-3">
            <button
                type="button"
                onClick={onSelect}
                className="flex min-w-0 items-center gap-3 text-left transition-opacity hover:opacity-80 cursor-pointer"
            >
                <Avatar name={user.name} src={user.profilePicture} size="md" />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                    <p className="truncate text-xs text-(--color-text-muted)">@{user.username}</p>
                </div>
            </button>
            <div className="flex shrink-0 gap-2 items-center">{action}</div>
        </li>
    );
}