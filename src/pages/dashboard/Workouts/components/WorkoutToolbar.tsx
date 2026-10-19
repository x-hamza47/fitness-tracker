import { IconSearch, IconX } from "@tabler/icons-react";
import RangeTabs from "@/components/dashboard/RangeTabs";
import {
    CATEGORY_CONFIG,
    SORT_OPTIONS,
    VIEW_OPTIONS,
    WORKOUT_CATEGORIES,
    type WorkoutView,
} from "@/features/workouts/workout.config";
import { cn } from "@/lib/utils";
import type { WorkoutCategory, WorkoutFilters, WorkoutSort } from "@/types/workout";

type WorkoutToolbarProps = {
    filters: WorkoutFilters;
    onChange: (patch: Partial<WorkoutFilters>) => void;
    onClear: () => void;
    hasActiveFilters: boolean;
    counts: Record<WorkoutCategory | "all", number>;
    tags: string[];
    view: WorkoutView;
    onViewChange: (view: WorkoutView) => void;
};

const SELECT =
    "cursor-pointer rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white [color-scheme:dark] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";

export default function WorkoutToolbar({
    filters,
    onChange,
    onClear,
    hasActiveFilters,
    counts,
    tags,
    view,
    onViewChange,
}: WorkoutToolbarProps) {
    const chips: { value: WorkoutCategory | "all"; label: string }[] = [
        { value: "all", label: "All" },
        ...WORKOUT_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_CONFIG[c].label })),
    ];

    return (
        <div className="space-y-4">
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
                        onChange={(e) => onChange({ search: e.target.value })}
                        placeholder="Search routines, tags or exercises"
                        aria-label="Search workouts"
                        className="w-full rounded-sm border border-white/10 bg-white/[0.02] py-2 pr-9 pl-9 text-sm text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
                    />
                    {filters.search && (
                        <button
                            type="button"
                            onClick={() => onChange({ search: "" })}
                            aria-label="Clear search"
                            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-1 text-white/40 transition-colors hover:text-white"
                        >
                            <IconX size={14} stroke={1.5} aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {tags.length > 0 && (
                        <select
                            value={filters.tag ?? ""}
                            onChange={(e) => onChange({ tag: e.target.value || null })}
                            aria-label="Filter by tag"
                            className={SELECT}
                        >
                            <option value="">All tags</option>
                            {tags.map((tag) => (
                                <option key={tag} value={tag}>
                                    #{tag}
                                </option>
                            ))}
                        </select>
                    )}

                    <select
                        value={filters.sort}
                        onChange={(e) => onChange({ sort: e.target.value as WorkoutSort })}
                        aria-label="Sort workouts"
                        className={SELECT}
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>

                    <RangeTabs label="View" options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {chips.map(({ value, label }) => {
                    const active = filters.category === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onChange({ category: value })}
                            className={cn(
                                "cursor-pointer rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                                active
                                    ? "border-white/40 bg-white/10 text-white"
                                    : "border-white/10 text-white/50 hover:border-white/25 hover:text-white",
                            )}
                        >
                            {label} <span className="ml-1 text-white/40 tabular-nums">{counts[value]}</span>
                        </button>
                    );
                })}

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="ml-1 cursor-pointer text-[10px] tracking-[0.15em] text-white/50 uppercase underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}