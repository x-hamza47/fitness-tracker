import { useState } from "react";
import { IconAlertTriangle, IconChevronLeft, IconChevronRight, IconFilterOff, IconHistory, IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { CATEGORY_CONFIG, WORKOUT_CATEGORIES } from "@/features/workouts/workout.config";
import { useDeleteWorkoutLog, useWorkoutLogs } from "@/features/workouts/useWorkoutLogs";
import { convertWeight, weightUnit } from "@/lib/units";
import { cn } from "@/lib/utils";
import type { UnitSystem } from "@/types/profile";
import { DEFAULT_LOG_FILTERS, type WorkoutLog, type WorkoutLogFilters } from "@/types/workoutLog";
import { StateMessage, WorkoutSkeletonGrid } from "./WorkoutStates";

type HistoryListProps = {
    unitSystem: UnitSystem;
};

type DeleteState = { open: boolean; log: WorkoutLog | null };

const INPUT =
    "rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white [color-scheme:dark] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-white tabular-nums">{value}</dd>
        </div>
    );
}

function LogRow({
    log,
    unitSystem,
    onDelete,
}: {
    log: WorkoutLog;
    unitSystem: UnitSystem;
    onDelete: (log: WorkoutLog) => void;
}) {
    const category = CATEGORY_CONFIG[log.category];
    const CategoryIcon = category.icon;
    const unit = weightUnit(unitSystem);
    const volume =
        log.totalVolumeKg > 0
            ? `${Math.round(convertWeight(log.totalVolumeKg, unitSystem)).toLocaleString("en")} ${unit}`
            : "Bodyweight";

    return (
        <article className="rounded-xl border border-white/10 bg-white/3 backdrop-blur-md shadow-lg transition-all hover:bg-white/5">
            <div className={cn("h-1 rounded-t-xl", category.bar)} />
            <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className={cn("flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase", category.text)}>
                            <CategoryIcon size={14} stroke={1.75} aria-hidden="true" />
                            {category.label}
                        </p>
                        <h3 className="mt-2 truncate text-lg font-semibold text-white">{log.name}</h3>
                        <p className="mt-1 text-xs text-(--color-text-muted)">{formatDate(log.performedAt)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onDelete(log)}
                        aria-label={`Delete session ${log.name}`}
                        className="cursor-pointer rounded-sm p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        <IconTrash size={18} stroke={1.5} aria-hidden="true" />
                    </button>
                </div>

                <dl className="mt-4 grid grid-cols-4 gap-3 border-y border-white/10 py-3">
                    <Stat label="Exercises" value={String(log.exercises.length)} />
                    <Stat label="Sets" value={String(log.totalSets)} />
                    <Stat label="Duration" value={`${log.durationMin} min`} />
                    <Stat label="Volume" value={volume} />
                </dl>

                {log.exercises.length > 0 && (
                    <details className="group mt-3">
                        <summary className="cursor-pointer text-[10px] tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white">
                            Show exercises
                        </summary>
                        <ul className="mt-3 space-y-3">
                            {log.exercises.map((e) => (
                                <li key={e.id}>
                                    <p className="text-sm text-white/80">{e.name}</p>
                                    <p className="mt-0.5 text-xs text-(--color-text-muted) tabular-nums">
                                        {e.sets
                                            .map((s) =>
                                                s.weightKg === null
                                                    ? `${s.reps}`
                                                    : `${s.reps} × ${convertWeight(s.weightKg, unitSystem)} ${unit}`,
                                            )
                                            .join(" · ")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </details>
                )}

                {log.notes && <p className="mt-3 text-xs text-white/60">{log.notes}</p>}
            </div>
        </article>
    );
}

export default function HistoryList({ unitSystem }: HistoryListProps) {
    const [filters, setFilters] = useState<WorkoutLogFilters>(DEFAULT_LOG_FILTERS);
    const [deleting, setDeleting] = useState<DeleteState>({ open: false, log: null });

    const { page, isLoading, isError, refetch } = useWorkoutLogs(filters);
    const del = useDeleteWorkoutLog();

    const patch = (changes: Partial<WorkoutLogFilters>) =>
        setFilters((f) => ({ ...f, page: 1, ...changes }));
    const clear = () => setFilters(DEFAULT_LOG_FILTERS);

    const hasActiveFilters =
        filters.search !== "" || filters.category !== "all" || filters.from !== "" || filters.to !== "";

    const handleDelete = async () => {
        if (!deleting.log) return;
        try {
            await del.removeAsync(deleting.log.id);
            setDeleting((d) => ({ ...d, open: false }));
        } catch {
            // The error is shown inside the dialog through errorMessage
        }
    };

    let content;
    if (isLoading) {
        content = <WorkoutSkeletonGrid count={3} />;
    } else if (isError) {
        content = (
            <StateMessage
                icon={IconAlertTriangle}
                title="Couldn't load your history"
                message="Something went wrong while fetching your sessions."
                action={
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="cursor-pointer rounded-sm border border-white/20 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        Try again
                    </button>
                }
            />
        );
    } else if (!page || page.items.length === 0) {
        content = hasActiveFilters ? (
            <StateMessage
                icon={IconFilterOff}
                title="No matching sessions"
                message="Nothing matches your search and filters."
                action={
                    <button
                        type="button"
                        onClick={clear}
                        className="cursor-pointer rounded-sm border border-white/20 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        Clear filters
                    </button>
                }
            />
        ) : (
            <StateMessage
                icon={IconHistory}
                title="No sessions yet"
                message="Log a routine from the Routines tab and it will show up here."
            />
        );
    } else {
        content = (
            <>
                <div className="grid gap-4 lg:grid-cols-2">
                    {page.items.map((log) => (
                        <LogRow
                            key={log.id}
                            log={log}
                            unitSystem={unitSystem}
                            onDelete={(l) => setDeleting({ open: true, log: l })}
                        />
                    ))}
                </div>

                {page.pages > 1 && (
                    <nav aria-label="History pages" className="flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                            disabled={page.page <= 1}
                            aria-label="Previous page"
                            className="cursor-pointer rounded-sm border border-white/15 p-2 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <IconChevronLeft size={16} stroke={1.5} aria-hidden="true" />
                        </button>
                        <span className="text-xs text-(--color-text-muted) tabular-nums">
                            Page {page.page} of {page.pages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                            disabled={page.page >= page.pages}
                            aria-label="Next page"
                            className="cursor-pointer rounded-sm border border-white/15 p-2 text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <IconChevronRight size={16} stroke={1.5} aria-hidden="true" />
                        </button>
                    </nav>
                )}
            </>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                    <IconSearch
                        size={16}
                        stroke={1.5}
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
                    />
                    <input
                        type="search"
                        value={filters.search}
                        onChange={(e) => patch({ search: e.target.value })}
                        placeholder="Search sessions or exercises"
                        aria-label="Search sessions"
                        className="w-full rounded-sm border border-white/10 bg-white/2 py-2 pr-9 pl-9 text-sm text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
                    />
                    {filters.search && (
                        <button
                            type="button"
                            onClick={() => patch({ search: "" })}
                            aria-label="Clear search"
                            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-1 text-white/40 transition-colors hover:text-white"
                        >
                            <IconX size={14} stroke={1.5} aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={filters.category}
                        onChange={(e) => patch({ category: e.target.value as WorkoutLogFilters["category"] })}
                        aria-label="Filter by category"
                        className={cn(INPUT, "cursor-pointer")}
                    >
                        <option value="all">All categories</option>
                        {WORKOUT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {CATEGORY_CONFIG[c].label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={filters.from}
                        max={filters.to || undefined}
                        onChange={(e) => patch({ from: e.target.value })}
                        aria-label="From date"
                        className={INPUT}
                    />
                    <input
                        type="date"
                        value={filters.to}
                        min={filters.from || undefined}
                        onChange={(e) => patch({ to: e.target.value })}
                        aria-label="To date"
                        className={INPUT}
                    />
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clear}
                            className="cursor-pointer text-[10px] tracking-[0.15em] text-white/50 uppercase underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {content}

            <ConfirmDialog
                open={deleting.open}
                title="Delete session?"
                message={`"${deleting.log?.name ?? ""}" will be permanently removed from your history. This can't be undone.`}
                isPending={del.isPending}
                errorMessage={del.errorMessage}
                onConfirm={handleDelete}
                onCancel={() => setDeleting((d) => ({ ...d, open: false }))}
            />
        </div>
    );
}