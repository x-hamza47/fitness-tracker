import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProfile } from "@/features/profile/useProfile";
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

function FollowersTab({ userId }: { userId: string }) {
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
                        action={
                            <button
                                type="button"
                                disabled={remove.isPending}
                                onClick={() => remove.mutate(u.id)}
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

function FollowingTab({ userId }: { userId: string }) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useFollowing(userId, page);

    if (isLoading) return <Loading />;
    if (!data?.items.length) return <Empty text="You aren't following anyone yet. Try Discover." />;

    return (
        <>
            <ul className="divide-y divide-white/10">
                {data.items.map((u) => (
                    <UserRow key={u.id} user={u} action={<FollowButton userId={u.id} status="accepted" />} />
                ))}
            </ul>
            <Pager page={page} pages={data.pages} onChange={setPage} />
        </>
    );
}

function RequestsTab() {
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
                        action={
                            <>
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => approve.mutate(r.requestId)}
                                    className="cursor-pointer rounded-sm bg-(--color-accent) px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-black uppercase hover:opacity-90 disabled:opacity-50"
                                >
                                    Approve
                                </button>
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => reject.mutate(r.requestId)}
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

function DiscoverTab() {
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
                                <UserRow key={u.id} user={u} action={<FollowButton userId={u.id} status={u.followStatus} />} />
                            ))}
                        </ul>
                        <Pager page={page} pages={data.pages} onChange={setPage} />
                    </>
                )}
            </div>
        </>
    );
}

export default function Followers() {
    const { profile } = useProfile();
    const [params, setParams] = useSearchParams();
    const requests = useRequests(1);

    const current = TABS.find((t) => t.id === params.get("tab"))?.id ?? "followers";
    const pendingCount = requests.data?.total ?? 0;

    if (!profile) return null;

    return (
        <div className="mx-auto max-w-3xl space-y-4">
            <header>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Community</p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Followers</h1>
                <p className="mt-1 text-sm text-(--color-text-muted)">
                    Manage who follows you and find new people.
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
                {current === "followers" && <FollowersTab userId={profile.id} />}
                {current === "following" && <FollowingTab userId={profile.id} />}
                {current === "requests" && <RequestsTab />}
                {current === "discover" && <DiscoverTab />}
            </section>
        </div>
    );
}