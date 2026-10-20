import { useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import ActionMenu from "@/components/ui/ActionMenu";
import { formatDayDate } from "@/features/nutrition/nutrition.config";
import { formatPerformanceValue, PERFORMANCE_CONFIG } from "@/features/progress/progress.config";
import type { UnitSystem } from "@/types/profile";
import type { PerformanceEntry, PerformanceMetricKey } from "@/types/progress";

type PerformanceLogProps = {
    /** Oldest first, as the API returns them */
    entries: PerformanceEntry[];
    unitSystem: UnitSystem;
    onAdd: () => void;
    onEdit: (entry: PerformanceEntry) => void;
    onDelete: (entry: PerformanceEntry) => void;
};

const VISIBLE_COUNT = 6;

/** The best record of each metric inside the list. Ties keep the earliest. */
function getBestIds(entries: PerformanceEntry[]): Set<string> {
    const best = new Map<PerformanceMetricKey, PerformanceEntry>();

    for (const entry of entries) {
        const current = best.get(entry.metric);
        const higherIsBetter = PERFORMANCE_CONFIG[entry.metric].better === "higher";
        const beats = current && (higherIsBetter ? entry.value > current.value : entry.value < current.value);
        if (!current || beats) best.set(entry.metric, entry);
    }

    return new Set(Array.from(best.values(), (e) => e.id));
}

export default function PerformanceLog({ entries, unitSystem, onAdd, onEdit, onDelete }: PerformanceLogProps) {
    const [showAll, setShowAll] = useState(false);

    const bestIds = getBestIds(entries);
    const newestFirst = [...entries].reverse();
    const visible = showAll ? newestFirst : newestFirst.slice(0, VISIBLE_COUNT);

    return (
        <section aria-label="Performance records" className="rounded-sm border border-white/10 bg-white/2 backdrop-blur-sm">
            <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white uppercase">Records</h2>
                <button
                    type="button"
                    onClick={onAdd}
                    aria-label="Log a record"
                    className="cursor-pointer rounded-sm p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    <IconPlus size={16} stroke={1.75} aria-hidden="true" />
                </button>
            </header>

            {entries.length === 0 ? (
                <p className="px-5 py-6 text-xs text-white/40">No records in this range.</p>
            ) : (
                <ul className="divide-y divide-white/10">
                    {visible.map((entry) => {
                        const { label, color } = PERFORMANCE_CONFIG[entry.metric];
                        return (
                            <li key={entry.id} className="flex items-start justify-between gap-3 px-5 py-4">
                                <div className="min-w-0">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                                        <span
                                            aria-hidden="true"
                                            className="size-2 shrink-0 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        {label}
                                        {bestIds.has(entry.id) && (
                                            <span className="rounded-full border border-white/15 px-2 py-0.5 text-[9px] font-normal tracking-[0.15em] text-white/60 uppercase">
                                                Best in range
                                            </span>
                                        )}
                                    </p>
                                    <p className="mt-1 text-sm text-white/90 tabular-nums">
                                        {formatPerformanceValue(entry.metric, entry.value, unitSystem)}
                                    </p>
                                    <p className="mt-1 text-xs text-(--color-text-muted)">{formatDayDate(entry.date)}</p>
                                    {entry.notes && <p className="mt-1 text-xs text-white/40 italic">{entry.notes}</p>}
                                </div>
                                <div className="-mt-1.5 -mr-1.5 shrink-0">
                                    <ActionMenu
                                        label={`Actions for ${label} record`}
                                        items={[
                                            { label: "Edit", icon: IconPencil, onClick: () => onEdit(entry) },
                                            {
                                                label: "Delete",
                                                icon: IconTrash,
                                                onClick: () => onDelete(entry),
                                                danger: true,
                                            },
                                        ]}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {entries.length > VISIBLE_COUNT && (
                <div className="border-t border-white/10 px-5 py-3">
                    <button
                        type="button"
                        onClick={() => setShowAll((s) => !s)}
                        className="cursor-pointer text-[10px] tracking-[0.15em] text-white/50 uppercase underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        {showAll ? "Show less" : `Show all ${entries.length}`}
                    </button>
                </div>
            )}
        </section>
    );
}