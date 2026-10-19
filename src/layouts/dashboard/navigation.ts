import type { Icon } from "@tabler/icons-react";
import {
    IconBarbell,
    IconBell,
    IconCompass,
    IconFileAnalytics,
    IconLayoutDashboard,
    IconLifebuoy,
    IconMessages,
    IconSettings,
    IconToolsKitchen2,
    IconTrendingUp,
    IconUsers,
} from "@tabler/icons-react";

/** Keys for live counters shown as a badge next to a nav item. */
export type NavBadgeKey = "notifications";

export type NavItem = {
    name: string;
    to: string;
    icon: Icon;
    /** true = only active on the exact path (needed for "/dashboard") */
    end?: boolean;
    /** shows a counter badge, the value is supplied by the sidebar */
    badge?: NavBadgeKey;
    /** appears in the mobile bottom tab bar */
    mobileTab?: boolean;
};

export type NavGroup = {
    label: string;
    items: NavItem[];
};

export const PROFILE_PATH = "/dashboard/profile";
export const FOLLOWERS_PATH = "/dashboard/followers";

export const NAV_GROUPS: NavGroup[] = [
    {
        label: "Training",
        items: [
            { name: "Overview", to: "/dashboard", icon: IconLayoutDashboard, end: true, mobileTab: true },
            { name: "Workouts", to: "/dashboard/workouts", icon: IconBarbell, mobileTab: true },
            { name: "Nutrition", to: "/dashboard/nutrition", icon: IconToolsKitchen2, mobileTab: true },
            { name: "Progress", to: "/dashboard/progress", icon: IconTrendingUp, mobileTab: true },
        ],
    },
    {
        label: "Community",
        items: [
            { name: "Discover", to: "/dashboard/discover", icon: IconCompass },
            { name: "Followers", to: "/dashboard/followers", icon: IconUsers },
            { name: "Forum", to: "/dashboard/forum", icon: IconMessages },
        ],
    },
    {
        label: "Account",
        items: [
            { name: "Notifications", to: "/dashboard/notifications", icon: IconBell, badge: "notifications" },
            { name: "Reports", to: "/dashboard/reports", icon: IconFileAnalytics },
            { name: "Settings", to: "/dashboard/settings", icon: IconSettings },
            { name: "Support", to: "/dashboard/support", icon: IconLifebuoy },
        ],
    },
];

const ALL_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

/** The 4 main pages shown in the mobile bottom tab bar. */
export const MOBILE_TABS: NavItem[] = ALL_ITEMS.filter((item) => item.mobileTab);

/** Groups for the mobile drawer, so the pages already in the tab bar aren't repeated. */
export const DRAWER_GROUPS: NavGroup[] = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.mobileTab),
})).filter((group) => group.items.length > 0);