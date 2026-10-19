import { NavLink, Outlet } from "react-router-dom";
import {
    IconBarbell,
    IconLayoutDashboard,
    IconLogout,
    IconToolsKitchen2,
    IconTrendingUp,
} from "@tabler/icons-react";
import { useAuthStore } from "@/stores/authStore";

const NAV_ITEMS = [
    { name: "Overview", to: "/dashboard", icon: IconLayoutDashboard, end: true },
    { name: "Workouts", to: "/dashboard/workouts", icon: IconBarbell, end: false },
    { name: "Nutrition", to: "/dashboard/nutrition", icon: IconToolsKitchen2, end: false },
    { name: "Progress", to: "/dashboard/progress", icon: IconTrendingUp, end: false },
];

function Logo() {
    return (
        <span className="text-lg font-bold tracking-[0.3em] text-white">FORGE</span>
    );
}

export default function DashboardLayout() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="min-h-screen bg-(--color-bg) text-(--color-text) lg:flex">
            {/* Desktop sidebar */}
            <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-[#0b0b0d] p-5 lg:flex">
                <Logo />

                <nav aria-label="Dashboard" className="mt-10 flex flex-col gap-1">
                    {NAV_ITEMS.map(({ name, to, icon: Icon, end }) => (
                        <NavLink
                            key={name}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors ${
                                    isActive
                                        ? "border-(--color-accent-dark) bg-white/5 text-white"
                                        : "border-transparent text-white/50 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={18} stroke={1.5} aria-hidden="true" />
                            {name}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto border-t border-white/10 pt-4">
                    <p className="truncate text-sm font-semibold text-white">
                        {user?.name ?? "Athlete"}
                    </p>
                    <p className="truncate text-xs text-(--color-text-muted)">
                        {user?.email}
                    </p>
                    <button
                        type="button"
                        onClick={logout}
                        className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-xs tracking-[0.15em] text-white/50 uppercase transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <IconLogout size={18} stroke={1.5} aria-hidden="true" />
                        Log out
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile top bar */}
                <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0b0d] px-4 py-3 lg:hidden">
                    <Logo />
                    <button
                        type="button"
                        onClick={logout}
                        aria-label="Log out"
                        className="cursor-pointer p-2 text-white/60 transition-colors hover:text-white"
                    >
                        <IconLogout size={20} stroke={1.5} aria-hidden="true" />
                    </button>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile bottom tabs */}
            <nav
                aria-label="Dashboard"
                className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-white/10 bg-[#0b0b0d] lg:hidden"
            >
                {NAV_ITEMS.map(({ name, to, icon: Icon, end }) => (
                    <NavLink
                        key={name}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 py-3 text-[10px] tracking-[0.15em] uppercase transition-colors ${
                                isActive ? "text-(--color-accent)" : "text-white/50"
                            }`
                        }
                    >
                        <Icon size={20} stroke={1.5} aria-hidden="true" />
                        {name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}