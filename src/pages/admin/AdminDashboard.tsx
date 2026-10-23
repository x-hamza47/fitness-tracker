import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    IconAlertCircle,
    IconBarbell,
    IconChevronRight,
    IconClock,
    IconLifebuoy,
    IconShieldCheck,
    IconToolsKitchen2,
    IconTrendingUp,
    IconUserCheck,
    IconUserPlus,
    IconUsers,
} from "@tabler/icons-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AnimatePresence, motion } from "motion/react";
import heroImg from "@/assets/dashboard-reveal.webp";
import Avatar from "@/components/ui/Avatar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useAdminStats } from "@/features/admin/useAdmin";
import { useProfile } from "@/features/profile/useProfile";
import { cn } from "@/lib/utils";

function greeting(h: number) {
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
}

const pad = (n: number) => String(n).padStart(2, "0");
function clock12(d: Date) {
    const h = d.getHours();
    return {
        text: `${pad(h % 12 || 12)}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
        period: h < 12 ? "AM" : "PM",
    };
}

function Digit({ ch, small }: { ch: string; small?: boolean }) {
    return (
        <span
            className={cn(
                "relative flex items-center justify-center overflow-hidden font-mono font-semibold text-(--color-accent) tabular-nums [text-shadow:0_0_14px_rgb(255_106_0/0.7)]",
                small ? "h-7 w-4 text-lg" : "h-8 w-5 text-xl sm:h-12 sm:w-8 sm:text-4xl",
            )}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={ch}
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    {ch}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

function Digits({ value, small }: { value: string; small?: boolean }) {
    return (
        <span aria-hidden="true" className="inline-flex flex-wrap items-center gap-x-0.5 sm:gap-x-1">
            {value.split("").map((ch, i) =>
                /\d/.test(ch) ? (
                    <Digit key={i} ch={ch} small={small} />
                ) : (
                    <span
                        key={i}
                        className={cn(
                            "font-mono text-white/50",
                            ch === " " ? "w-1" : small ? "text-lg" : "text-xl sm:text-3xl",
                        )}
                    >
                        {ch}
                    </span>
                ),
            )}
        </span>
    );
}

export default function AdminDashboard() {
    const { profile } = useProfile();
    const { data: stats, isLoading, isError, refetch } = useAdminStats();
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const time = clock12(now);

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Top Welcome Hero with Live Timer & 3D Cards */}
            <section
                aria-label="Admin Welcome and Overview"
                className="grid grid-cols-1 gap-4 lg:grid-cols-3"
            >
                {/* Welcome Hero with Aceternity backdrop & animated timer */}
                <div className="min-w-0 lg:col-span-2">
                    <section
                        aria-label="Welcome"
                        className="relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-2xl border border-white/15 p-6 shadow-[0_8px_32px_rgb(0_0_0/0.35)] backdrop-blur-md sm:p-8"
                    >
                        <img
                            src={heroImg}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 size-full object-cover opacity-25"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-linear-to-br from-black/85 via-black/55 to-(--color-accent)/20"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute -top-16 -left-16 size-64 rounded-full bg-(--color-accent)/25 blur-3xl"
                        />

                        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <p className="text-[10px] tracking-[0.25em] text-white/60 uppercase">
                                        System Active • {now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
                                    </p>
                                </div>
                                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                                    {greeting(now.getHours())},
                                    <br />
                                    <span className="bg-linear-to-r from-(--color-accent) to-(--color-accent-dark) bg-clip-text text-transparent">
                                        {profile?.name ? profile.name : "Administrator"}
                                    </span>
                                </h1>
                                <p className="mt-3 max-w-md text-sm text-white/60">
                                    Forge platform command centre. Monitor athlete registrations, user activity, and support queues in real time.
                                </p>
                            </div>

                            {/* Live Timer */}
                            <div className="flex shrink-0 flex-col items-start rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md sm:items-end">
                                <span className="text-[9px] tracking-[0.2em] text-white/40 uppercase mb-1 flex items-center gap-1">
                                    <IconClock size={12} className="text-(--color-accent)" /> Server Time
                                </span>
                                <time dateTime={now.toISOString()} className="flex items-end gap-1.5">
                                    <Digits value={time.text} />
                                    <span className="pb-1 font-mono text-sm font-semibold text-(--color-accent)">
                                        {time.period}
                                    </span>
                                </time>
                            </div>
                        </div>

                        {/* Quick Telemetry Bar inside Hero */}
                        <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white/15">
                                <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">Registered Athletes</p>
                                <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                                    {isLoading ? "..." : stats?.totalUsers.toLocaleString()}
                                </p>
                                <p className="mt-1 text-xs text-white/50">
                                    {stats?.activeUsers ?? 0} active athletes online
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white/15">
                                <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">Support Queue</p>
                                <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                                    {isLoading ? "..." : `${stats?.openTickets.toLocaleString()} Open`}
                                </p>
                                <p className="mt-1 text-xs text-white/50">Awaiting administrator reply</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Aceternity 3D Card for Quick Actions & System Security */}
                <div className="min-w-0 flex items-center justify-center">
                    <CardContainer className="w-full" containerClassName="py-0 w-full h-full">
                        <CardBody className="relative h-full w-full rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <CardItem translateZ="30">
                                        <div className="flex items-center gap-2">
                                            <IconShieldCheck className="text-(--color-accent)" size={20} />
                                            <span className="text-xs font-semibold tracking-wider text-white uppercase">
                                                Admin Control
                                            </span>
                                        </div>
                                    </CardItem>
                                    <CardItem translateZ="20">
                                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300 border border-emerald-500/30">
                                            Secure Tier 1
                                        </span>
                                    </CardItem>
                                </div>

                                <CardItem translateZ="40" className="mt-4">
                                    <p className="text-sm font-semibold text-white">Platform Controls</p>
                                    <p className="mt-1 text-xs text-(--color-text-muted)">
                                        Perform CRUD operations, manage users and tickets, or edit account credentials.
                                    </p>
                                </CardItem>

                                <CardItem translateZ="50" className="mt-4 space-y-2">
                                    <Link
                                        to="/admin/users"
                                        className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-2.5 text-xs text-white transition-colors hover:bg-white/10 hover:border-white/20"
                                    >
                                        <div className="flex items-center gap-2">
                                            <IconUsers size={16} className="text-(--color-accent)" />
                                            <span>Manage Users & Roles</span>
                                        </div>
                                        <IconChevronRight size={14} className="text-white/40" />
                                    </Link>

                                    <Link
                                        to="/admin/tickets"
                                        className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 p-2.5 text-xs text-white transition-colors hover:bg-white/10 hover:border-white/20"
                                    >
                                        <div className="flex items-center gap-2">
                                            <IconLifebuoy size={16} className="text-cyan-400" />
                                            <span>Review Support Tickets</span>
                                        </div>
                                        <IconChevronRight size={14} className="text-white/40" />
                                    </Link>
                                </CardItem>
                            </div>

                            <CardItem translateZ="30" className="mt-6 pt-3 border-t border-white/10">
                                <div className="flex items-center justify-between text-[11px] text-white/50">
                                    <span>Version 2.4.0 (Forge Core)</span>
                                    <span className="text-emerald-400 font-medium">99.9% Uptime</span>
                                </div>
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>
            </section>

            {isError && (
                <div className="flex items-center justify-between rounded-sm border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <IconAlertCircle size={18} />
                        <span>Failed to load admin stats.</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="underline underline-offset-4 hover:text-white"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Stat Cards Grid with backdrop-blur */}
            <section aria-label="System Metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <div className="rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                            Registered
                        </span>
                        <IconUsers size={16} className="text-white/40" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white tabular-nums">
                        {isLoading ? "..." : stats?.totalUsers.toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] text-(--color-text-muted)">All athlete accounts</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                            Active
                        </span>
                        <IconUserCheck size={16} className="text-emerald-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white tabular-nums">
                        {isLoading ? "..." : stats?.activeUsers.toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] text-(--color-text-muted)">Active athletes</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                            New (7D)
                        </span>
                        <IconUserPlus size={16} className="text-(--color-accent)" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white tabular-nums">
                        {isLoading ? "..." : stats?.newUsersThisWeek.toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] text-(--color-text-muted)">Signups past week</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                            Workouts
                        </span>
                        <IconBarbell size={16} className="text-(--color-accent)" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white tabular-nums">
                        {isLoading ? "..." : stats?.workoutsLogged.toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] text-(--color-text-muted)">Sessions completed</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                            Meals Logged
                        </span>
                        <IconToolsKitchen2 size={16} className="text-amber-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white tabular-nums">
                        {isLoading ? "..." : stats?.mealsLogged.toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] text-(--color-text-muted)">Daily nutrition logs</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                            Support Tickets
                        </span>
                        <IconLifebuoy size={16} className="text-cyan-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white tabular-nums">
                        {isLoading ? "..." : stats?.openTickets.toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] text-(--color-text-muted)">Awaiting reply</p>
                </div>
            </section>

            {/* Recharts System Activity Chart & Telemetry */}
            <div className="grid gap-4 lg:grid-cols-3">
                {/* 7-Day Activity & Growth Recharts Graph */}
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-md shadow-xl lg:col-span-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <IconTrendingUp className="text-(--color-accent)" size={18} />
                                <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                                    Platform Activity & Registrations (7D)
                                </h3>
                            </div>
                            <p className="mt-1 text-xs text-(--color-text-muted)">
                                Real-time volume of completed workouts and new athlete registrations.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-white/70">
                                <span className="size-2 rounded-full bg-(--color-accent)" />
                                Workouts
                            </span>
                            <span className="flex items-center gap-1.5 text-white/70">
                                <span className="size-2 rounded-full bg-cyan-400" />
                                New Signups
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={stats?.activityTrend ?? []}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="workoutGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff6a00" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ff6a00" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.4)"
                                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                                    tickFormatter={(str: string) => {
                                        const d = new Date(str);
                                        return d.toLocaleDateString("en", { weekday: "short" });
                                    }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.4)"
                                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        borderRadius: "6px",
                                        backdropFilter: "blur(8px)",
                                        fontSize: "12px",
                                    }}
                                    labelStyle={{ color: "#fff", fontWeight: 600, marginBottom: "4px" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="workouts"
                                    name="Workouts"
                                    stroke="#ff6a00"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#workoutGrad)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="newUsers"
                                    name="New Users"
                                    stroke="#22d3ee"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#userGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Support Tickets Card */}
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <IconLifebuoy className="text-cyan-400" size={18} />
                                <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                                    Recent Tickets
                                </h3>
                            </div>
                            <Link
                                to="/admin/tickets"
                                className="text-[10px] tracking-[0.15em] text-(--color-accent) uppercase hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-3 divide-y divide-white/5">
                            {!stats?.recentTickets || stats.recentTickets.length === 0 ? (
                                <p className="py-8 text-center text-xs text-white/50">No support tickets.</p>
                            ) : (
                                stats.recentTickets.slice(0, 4).map((ticket) => (
                                    <div key={ticket.id} className="py-2.5">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-xs font-semibold text-white">
                                                {ticket.subject}
                                            </p>
                                            <span
                                                className={cn(
                                                    "rounded-xs px-1.5 py-0.2 text-[9px] uppercase font-semibold",
                                                    ticket.status === "open"
                                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                        : ticket.status === "in_progress"
                                                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                                )}
                                            >
                                                {ticket.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <p className="truncate text-[11px] text-(--color-text-muted) mt-0.5">
                                            From {ticket.user?.name ?? "User"} •{" "}
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <Link
                        to="/admin/tickets"
                        className="mt-4 block w-full rounded-sm border border-white/10 bg-white/5 py-2 text-center text-[10px] font-semibold tracking-wider text-white uppercase hover:bg-white/10"
                    >
                        Open Ticket Desk
                    </Link>
                </div>
            </div>

            {/* Recent Registered Athletes */}
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                        <IconUsers className="text-(--color-accent)" size={18} />
                        <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                            Recently Joined Athletes
                        </h3>
                    </div>
                    <Link
                        to="/admin/users"
                        className="text-[10px] tracking-[0.15em] text-(--color-accent) uppercase hover:underline"
                    >
                        Manage All Users
                    </Link>
                </div>

                <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs text-white/80">
                        <thead className="border-b border-white/5 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                            <tr>
                                <th className="py-2.5 px-3">Athlete</th>
                                <th className="py-2.5 px-3">Email</th>
                                <th className="py-2.5 px-3">Status</th>
                                <th className="py-2.5 px-3">Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {!stats?.recentUsers || stats.recentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-white/50">
                                        No recent signups.
                                    </td>
                                </tr>
                            ) : (
                                stats.recentUsers.map((u) => (
                                    <tr key={u.id} className="transition-colors hover:bg-white/2">
                                        <td className="py-2.5 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar name={u.name} src={u.profilePicture} size="sm" />
                                                <div>
                                                    <p className="font-semibold text-white">{u.name}</p>
                                                    <p className="text-[11px] text-(--color-text-muted)">
                                                        @{u.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-white/70">{u.email}</td>
                                        <td className="py-2.5 px-3">
                                            <span
                                                className={cn(
                                                    "rounded-xs px-2 py-0.5 text-[9px] font-semibold uppercase",
                                                    u.isActive
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                        : "bg-red-500/10 text-red-400 border border-red-500/30",
                                                )}
                                            >
                                                {u.isActive ? "Active" : "Deactivated"}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-(--color-text-muted)">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
