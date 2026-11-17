import { NavLink } from "react-router-dom";
import {
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconLogout,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/uiStore";
import SidebarProfile from "./SidebarProfile";
import { getNavGroups, type NavBadgeKey, type NavItem } from "./navigation";
import { useLogout } from "@/features/auth/useLogout";
import { useUnreadCount } from "@/features/social/useNotifications";
import { useAuthStore } from "@/stores/authStore";

function useNavBadges(): Record<NavBadgeKey, number> {
    const notifications = useUnreadCount();
    return { notifications };
}
export function Logo({
    compact = false,
    className,
}: {
    compact?: boolean;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "text-lg font-bold text-white",
                compact ? "tracking-normal" : "tracking-[0.3em]",
                className,
            )}
        >
            {compact ? "F" : "FORGE"}
        </span>
    );
}

type SidebarContentProps = {
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onNavigate?: () => void;
};

function NavBadge({ count, collapsed }: { count: number; collapsed: boolean }) {
    if (count <= 0) return null;

    if (collapsed) {
        return (
            <span
                aria-label={`${count} unread`}
                className="absolute top-1.5 right-1.5 size-2 rounded-full bg-(--color-accent)"
            />
        );
    }

    return (
        <span
            aria-label={`${count} unread`}
            className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-(--color-accent) px-1.5 py-0.5 text-[10px] font-semibold text-black"
        >
            {count > 99 ? "99+" : count}
        </span>
    );
}

function SidebarLink({
    item,
    badgeCount,
    collapsed,
    onNavigate,
}: {
    item: NavItem;
    badgeCount: number;
    collapsed: boolean;
    onNavigate?: () => void;
}) {
    const { name, to, icon: Icon, end } = item;

    return (
        <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            title={collapsed ? name : undefined}
            aria-label={collapsed ? name : undefined}
            className={({ isActive }) =>
                cn(
                    "relative flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-xs tracking-[0.15em] whitespace-nowrap uppercase transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                    collapsed && "justify-center",
                    isActive
                        ? "border-(--color-accent-dark) bg-white/5 text-white"
                        : "border-transparent text-white/50 hover:bg-white/5 hover:text-white",
                )
            }
        >
            <Icon size={18} stroke={1.5} className="shrink-0" aria-hidden="true" />
            {!collapsed && name}
            {item.badge && <NavBadge count={badgeCount} collapsed={collapsed} />}
        </NavLink>
    );
}

export function SidebarContent({
    collapsed = false,
    onToggleCollapse,
    onNavigate,
}: SidebarContentProps) {
    const logout = useLogout();
    const badges = useNavBadges();
    const user = useAuthStore((s) => s.user);
    const isAdmin = user?.role === "admin";
    const navGroups = getNavGroups(isAdmin);

    const ToggleIcon = collapsed
        ? IconLayoutSidebarLeftExpand
        : IconLayoutSidebarLeftCollapse;

    return (
        <div className="flex h-full flex-col">
            { }
            <div
                className={cn(
                    "flex items-center",
                    collapsed ? "flex-col gap-3" : "justify-between",
                )}
            >
                <Logo compact={collapsed} />
                {onToggleCollapse && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        aria-expanded={!collapsed}
                        className="cursor-pointer rounded-sm p-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        <ToggleIcon size={20} stroke={1.5} aria-hidden="true" />
                    </button>
                )}
            </div>

            { }
            <div className="mt-6 border-b border-white/10 pb-5">
                <SidebarProfile collapsed={collapsed} onNavigate={onNavigate} />
            </div>

            <nav
                aria-label="Dashboard"
                className="no-scrollbar mt-5 flex-1 space-y-5 overflow-x-hidden overflow-y-auto"
            >
                {navGroups.map((group, index) => (
                    <div key={group.label}>
                        {collapsed ? (

                            index > 0 && <div className="mx-3 mb-3 h-px bg-white/10" />
                        ) : (
                            <p className="mb-2 px-3 text-[10px] tracking-[0.25em] text-white/30 uppercase">
                                {group.label}
                            </p>
                        )}
                        <div className="flex flex-col gap-1">
                            {group.items.map((item) => (
                                <SidebarLink
                                    key={item.to}
                                    item={item}
                                    badgeCount={item.badge ? badges[item.badge] : 0}
                                    collapsed={collapsed}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-4">
                <button
                    type="button"
                    onClick={logout}
                    title={collapsed ? "Log out" : undefined}
                    aria-label={collapsed ? "Log out" : undefined}
                    className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-xs tracking-[0.15em] whitespace-nowrap text-white/50 uppercase transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                        collapsed && "justify-center",
                    )}
                >
                    <IconLogout size={18} stroke={1.5} className="shrink-0" aria-hidden="true" />
                    {!collapsed && "Log out"}
                </button>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const collapsed = useUiStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useUiStore((s) => s.toggleSidebar);

    return (
        <aside
            className={cn(
                "sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-white/10 bg-[#0b0b0d] transition-[width,padding] duration-200 ease-out lg:block",
                collapsed ? "w-18 p-3" : "w-64 p-5",
            )}
        >
            <SidebarContent collapsed={collapsed} onToggleCollapse={toggleSidebar} />
        </aside>
    );
}