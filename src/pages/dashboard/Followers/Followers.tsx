import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    IconBarbell,
    IconCalendar,
    IconClock,
    IconLock,
    IconUsers,
} from "@tabler/icons-react";
import Avatar from "@/components/ui/Avatar";
import Drawer from "@/components/ui/Drawer";
import { useProfile, usePublicProfile } from "@/features/profile/useProfile";
import {
    useApproveRequest,
    useFollowers,
    useFollowing,
    useRejectRequest,
    useRemoveFollower,
    useRequests,
    useSearchUsers,
} from "@/features/social/useFollow";
import { cn } from "@/lib/utils";
import { INPUT } from "@/pages/dashboard/Progress/components/Field";
import FollowButton from "./components/FollowButton";
import UserRow from "./components/UserRow";

type Tab = "followers" | "following" | "requests" | "discover";

const TABS: { id: Tab; label: string }[] = [
    { id: "followers", label: "Followers" },
    { id: "following", label: "Following" },
    { id: "requests", label: "Requests" },
    { id: "discover", label: "Discover" },
];

const SMALL_BUTTON =
    "cursor-pointer rounded-sm border border-white/20 px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

function Pager({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
    if (pages <= 1) return null;
    return (
        <div className="mt-4 flex items-center justify-between text-xs text-white/50">
            <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className={SMALL_BUTTON}>
                Previous
            </button>
            <span>
                Page {page} of {pages}
            </span>
            <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)} className={SMALL_BUTTON}>
                Next
            </button>
        </div>
    );
}

function Empty({ text }: { text: string }) {
    return <p className="py-10 text-center text-xs text-(--color-text-muted)">{text}</p>;
}

function Loading() {
    return <div aria-hidden="true" className="h-40 animate-pulse rounded-sm bg-white/5" />;
}

function FollowersTab({
    userId,
    onSelectUser,
}: {
    userId: string;
    onSelectUser: (username: string) => void;
}) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useFollowers(userId, page);
    const remove = useRemoveFollower();

    if (isLoading) return <Loading />;
    if (!data?.items.length) return <Empty text="No followers yet." />;

    return (
        <>
            <ul className="divide-y divide-white/10">
                {data.items.map((u) => (
                    <UserRow
                        key={u.id}
                        user={u}
                        onSelect={() => onSelectUser(u.username)}
                        action={
                            <button
                                type="button"
                                disabled={remove.isPending}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    remove.mutate(u.id);
                                }}
                                className={SMALL_BUTTON}
                            >
                                Remove
                            </button>
                        }
                    />
                ))}
            </ul>
            <Pager page={page} pages={data.pages} onChange={setPage} />
        </>
    );
}

function FollowingTab({
    userId,
    onSelectUser,
}: {
    userId: string;
    onSelectUser: (username: string) => void;
}) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useFollowing(userId, page);

    if (isLoading) return <Loading />;
    if (!data?.items.length) return <Empty text="You aren't following anyone yet. Try Discover." />;

    return (
        <>
            <ul className="divide-y divide-white/10">
                {data.items.map((u) => (
                    <UserRow
                        key={u.id}
                        user={u}
                        onSelect={() => onSelectUser(u.username)}
                        action={<FollowButton userId={u.id} status="accepted" />}
                    />
                ))}
            </ul>
            <Pager page={page} pages={data.pages} onChange={setPage} />
        </>
    );
}

function RequestsTab({ onSelectUser }: { onSelectUser: (username: string) => void }) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useRequests(page);
    const approve = useApproveRequest();
    const reject = useRejectRequest();
    const busy = approve.isPending || reject.isPending;

    if (isLoading) return <Loading />;
    if (!data?.items.length) return <Empty text="No pending follow requests." />;

    return (
        <>
            <ul className="divide-y divide-white/10">
                {data.items.map((r) => (
                    <UserRow
                        key={r.requestId}
                        user={r.user}
                        onSelect={() => onSelectUser(r.user.username)}
                        action={
                            <>
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        approve.mutate(r.requestId);
                                    }}
                                    className="cursor-pointer rounded-sm bg-(--color-accent) px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-black uppercase hover:opacity-90 disabled:opacity-50"
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        reject.mutate(r.requestId);
                                    }}
                                    className={SMALL_BUTTON}
                                >
                                    Reject
                                </button>
                            </>
                        }
                    />
                ))}
            </ul>
            <Pager page={page} pages={data.pages} onChange={setPage} />
        </>
    );
}

function DiscoverTab({ onSelectUser }: { onSelectUser: (username: string) => void }) {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const { data, isFetching } = useSearchUsers(q, page);
    const hasTerm = q.trim().length >= 2;

    return (
        <>
            <input
                value={q}
                onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                }}
                placeholder="Search by name or username"
                aria-label="Search users"
                className={INPUT}
            />
            <div className="mt-3">
                {!hasTerm ? (
                    <Empty text="Type at least 2 characters to search." />
                ) : isFetching && !data ? (
                    <Loading />
                ) : !data?.items.length ? (
                    <Empty text="No users found." />
                ) : (
                    <>
                        <ul className="divide-y divide-white/10">
                            {data.items.map((u) => (
                                <UserRow
                                    key={u.id}
                                    user={u}
                                    onSelect={() => onSelectUser(u.username)}
                                    action={<FollowButton userId={u.id} status={u.followStatus} />}
                                />
                            ))}
                        </ul>
                        <Pager page={page} pages={data.pages} onChange={setPage} />
                    </>
                )}
            </div>
        </>
    );
}

function AthleteProfileDrawer({
    username,
    onClose,
}: {
    username: string | null;
    onClose: () => void;
}) {
    const { data: profile, isLoading } = usePublicProfile(username);

    return (
        <Drawer
            open={!!username}
            onClose={onClose}
            title={profile ? profile.name : "Athlete Profile"}
            description={profile ? `@${profile.username}` : "Viewing community athlete."}
        >
            {isLoading ? (
                <div className="p-8 text-center text-xs text-white/50">Loading athlete profile...</div>
            ) : profile ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-4 rounded-sm border border-white/10 bg-white/3 p-4">
                        <Avatar name={profile.name} src={profile.profilePicture} size="lg" ring />
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold text-white">{profile.name}</h3>
                            <p className="truncate text-xs text-(--color-text-muted)">@{profile.username}</p>
                            {profile.bio && <p className="mt-1 text-xs text-white/80">{profile.bio}</p>}
                        </div>
                        {profile.followStatus !== undefined && (
                            <FollowButton
                                userId={profile.id}
                                status={profile.followStatus === "none" ? null : profile.followStatus}
                            />
                        )}
                    </div>

                    {/* Stats Counter */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-sm border border-white/10 bg-white/2 p-3 text-center">
                            <IconUsers size={16} className="mx-auto text-white/40" />
                            <p className="mt-1 text-lg font-bold text-white tabular-nums">
                                {profile.stats.followers}
                            </p>
                            <p className="text-[10px] text-white/50 uppercase">Followers</p>
                        </div>
                        <div className="rounded-sm border border-white/10 bg-white/2 p-3 text-center">
                            <IconUsers size={16} className="mx-auto text-white/40" />
                            <p className="mt-1 text-lg font-bold text-white tabular-nums">
                                {profile.stats.following}
                            </p>
                            <p className="text-[10px] text-white/50 uppercase">Following</p>
                        </div>
                        <div className="rounded-sm border border-white/10 bg-white/2 p-3 text-center">
                            <IconBarbell size={16} className="mx-auto text-(--color-accent)" />
                            <p className="mt-1 text-lg font-bold text-white tabular-nums">
                                {profile.stats.workouts}
                            </p>
                            <p className="text-[10px] text-white/50 uppercase">Workouts</p>
                        </div>
                    </div>

                    {/* Workouts History */}
                    <div>
                        <h4 className="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-3 flex items-center gap-1.5">
                            <IconBarbell size={14} className="text-(--color-accent)" /> Recent Workout Sessions
                        </h4>

                        {!profile.canView ? (
                            <div className="rounded-sm border border-dashed border-white/10 p-8 text-center text-xs text-white/50 flex flex-col items-center gap-2">
                                <IconLock size={20} className="text-white/40" />
                                <p>This athlete's profile is private.</p>
                                <p className="text-[11px] text-(--color-text-muted)">
                                    Follow them to view their workout history and fitness telemetry.
                                </p>
                            </div>
                        ) : !profile.recentWorkouts || profile.recentWorkouts.length === 0 ? (
                            <div className="rounded-sm border border-dashed border-white/10 p-8 text-center text-xs text-(--color-text-muted)">
                                No recent workout sessions recorded yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {profile.recentWorkouts.map((w) => (
                                    <div
                                        key={w.id}
                                        className="rounded-sm border border-white/10 bg-white/2 p-3.5 space-y-1.5 transition-colors hover:bg-white/4"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-white truncate">
                                                {w.name}
                                            </span>
                                            <span className="rounded-xs bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-(--color-accent) uppercase">
                                                {w.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-(--color-text-muted)">
                                            <span className="flex items-center gap-1">
                                                <IconCalendar size={12} />
                                                {new Date(w.performedAt).toLocaleDateString()}
                                            </span>
                                            {w.durationMin && (
                                                <span className="flex items-center gap-1">
                                                    <IconClock size={12} />
                                                    {w.durationMin} mins
                                                </span>
                                            )}
                                            <span>• {w.exerciseCount} exercises</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </Drawer>
    );
}

export default function Followers() {
    const { profile } = useProfile();
    const [params, setParams] = useSearchParams();
    const requests = useRequests(1);
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

    const current = TABS.find((t) => t.id === params.get("tab"))?.id ?? "followers";
    const pendingCount = requests.data?.total ?? 0;

    if (!profile) return null;

    return (
        <div className="mx-auto max-w-3xl space-y-4">
            <header>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Community</p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Followers & Athletes</h1>
                <p className="mt-1 text-sm text-(--color-text-muted)">
                    Connect with athletes, check their workout routines, and grow your community.
                </p>
            </header>

            <div role="tablist" aria-label="Followers sections" className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={current === t.id}
                        onClick={() => setParams({ tab: t.id })}
                        className={cn(
                            "cursor-pointer rounded-sm border px-3 py-2 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                            current === t.id
                                ? "border-(--color-accent) bg-(--color-accent)/10 text-white"
                                : "border-white/10 text-white/60 hover:bg-white/5",
                        )}
                    >
                        {t.label}
                        {t.id === "requests" && pendingCount > 0 && ` (${pendingCount})`}
                    </button>
                ))}
            </div>

            <section className="rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm">
                {current === "followers" && (
                    <FollowersTab userId={profile.id} onSelectUser={setSelectedUsername} />
                )}
                {current === "following" && (
                    <FollowingTab userId={profile.id} onSelectUser={setSelectedUsername} />
                )}
                {current === "requests" && (
                    <RequestsTab onSelectUser={setSelectedUsername} />
                )}
                {current === "discover" && (
                    <DiscoverTab onSelectUser={setSelectedUsername} />
                )}
            </section>

            {/* Athlete Profile Drawer */}
            <AthleteProfileDrawer
                username={selectedUsername}
                onClose={() => setSelectedUsername(null)}
            />
        </div>
    );
}