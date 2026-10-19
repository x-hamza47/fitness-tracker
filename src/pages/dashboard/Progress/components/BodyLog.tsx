import { useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import ActionMenu from "@/components/ui/ActionMenu";
import { formatDayDate } from "@/features/nutrition/nutrition.config";
import { convertLength, lengthUnit, MEASUREMENT_CONFIG } from "@/features/progress/progress.config";
import { convertWeight, weightUnit } from "@/lib/units";
import type { UnitSystem } from "@/types/profile";
import { MEASUREMENT_KEYS, type BodyEntry } from "@/types/progress";

type BodyLogProps = {
    /** Oldest first, as the API returns them */
    entries: BodyEntry[];
    unitSystem: UnitSystem;
    onAdd: () => void;
    onEdit: (entry: BodyEntry) => void;
    onDelete: (entry: BodyEntry) => void;
};

const VISIBLE_COUNT = 6;

export default function BodyLog({ entries, unitSystem, onAdd, onEdit, onDelete }: BodyLogProps) {
    const [showAll, setShowAll] = useState(false);

    const newestFirst = [...entries].reverse();
    const visible = showAll ? newestFirst : newestFirst.slice(0, VISIBLE_COUNT);
    const unit = lengthUnit(unitSystem);

    return (
        <section aria-label="Body check-ins" className="rounded-sm border border-white/10 bg-white/[0.02]">
            <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white uppercase">Check-ins</h2>
                <button
                    type="button"
                    onClick={onAdd}
                    aria-label="Log a check-in"
                    className="cursor-pointer rounded-sm p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    <IconPlus size={16} stroke={1.75} aria-hidden="true" />
                </button>
            </header>

            {entries.length === 0 ? (
                <p className="px-5 py-6 text-xs text-white/40">No check-ins in this range.</p>
            ) : (
                <ul className="divide-y divide-white/10">
                    {visible.map((entry) => {
                        const measured = MEASUREMENT_KEYS.flatMap((key) => {
                            const cm = entry.measurements[key];
                            return cm === undefined
                                ? []
                                : [`${MEASUREMENT_CONFIG[key].label} ${convertLength(cm, unitSystem)} ${unit}`];
                        });

                        return (
                            <li key={entry.id} className="flex items-start justify-between gap-3 px-5 py-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">{formatDayDate(entry.date)}</p>
                                    {entry.weightKg !== null && (
                                        <p className="mt-1 text-sm text-white/90 tabular-nums">
                                            {convertWeight(entry.weightKg, unitSystem)} {weightUnit(unitSystem)}
                                        </p>
                                    )}
                                    {measured.length > 0 && (
                                        <p className="mt-1 text-xs text-(--color-text-muted)">{measured.join(" · ")}</p>
                                    )}
                                    {entry.notes && <p className="mt-1 text-xs text-white/40 italic">{entry.notes}</p>}
                                </div>
                                <div className="-mt-1.5 -mr-1.5 shrink-0">
                                    <ActionMenu
                                        label={`Actions for ${formatDayDate(entry.date)} check-in`}
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