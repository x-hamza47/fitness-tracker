import { IconCopy, IconPencil, IconPlayerPlay, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import ActionMenu from "@/components/ui/ActionMenu";
import { CATEGORY_CONFIG, type WorkoutView } from "@/features/workouts/workout.config";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";
import { convertWeight, weightUnit } from "@/lib/units";
import { getWorkoutVolumeKg, type Exercise, type Workout } from "@/types/workout";
import type { UnitSystem } from "@/types/profile";

type WorkoutCardProps = {
    workout: Workout;
    unitSystem: UnitSystem;
    view: WorkoutView;
    onEdit: (workout: Workout) => void;
    onDuplicate: (workout: Workout) => void;
    onDelete: (workout: Workout) => void;
    onToggleFavorite: (workout: Workout) => void;
    onTagClick: (tag: string) => void;
    onLog: (workout: Workout) => void;
};

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-white tabular-nums">{value}</dd>
        </div>
    );
}

function formatExercise(e: Exercise, unitSystem: UnitSystem): string {
    const base = `${e.sets} × ${e.reps}`;
    if (e.weightKg === null) return base;
    return `${base} · ${convertWeight(e.weightKg, unitSystem)} ${weightUnit(unitSystem)}`;
}

const PREVIEW_COUNT = 3;

export default function WorkoutCard({
    workout,
    unitSystem,
    view,
    onEdit,
    onDuplicate,
    onDelete,
    onToggleFavorite,
    onTagClick,
    onLog,
}: WorkoutCardProps) {
    const category = CATEGORY_CONFIG[workout.category];
    const CategoryIcon = category.icon;
    const isList = view === "list";

    const volumeKg = getWorkoutVolumeKg(workout);
    const volume =
        volumeKg > 0
            ? `${Math.round(convertWeight(volumeKg, unitSystem)).toLocaleString("en")} ${weightUnit(unitSystem)}`
            : "Bodyweight";
    const lastPerformed = workout.lastPerformedAt
        ? `Last done ${timeAgo(workout.lastPerformedAt)}`
        : "Never performed";

    const hiddenCount = workout.exercises.length - PREVIEW_COUNT;

    return (
        <article className="group relative flex flex-col rounded-xl border border-white/10 bg-white/3 transition-all hover:border-white/25 hover:bg-white/5 backdrop-blur-md shadow-lg">
            <div className={cn("h-1 rounded-t-xl", category.bar)} />

            <div className={cn("flex flex-1 flex-col gap-4 p-5", isList && "sm:flex-row sm:items-center sm:gap-6")}>
                {/* Identity */}
                <div className={cn("min-w-0", isList && "sm:flex-1")}>
                    <div className="flex items-center justify-between gap-2">
                        <p className={cn("flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase", category.text)}>
                            <CategoryIcon size={14} stroke={1.75} aria-hidden="true" />
                            {category.label}
                        </p>

                        {!isList && (
                            <div className="-mr-1.5 flex items-center">
                                <FavoriteButton workout={workout} onToggle={onToggleFavorite} />
                                <CardMenu
                                    workout={workout}
                                    onEdit={onEdit}
                                    onDuplicate={onDuplicate}
                                    onDelete={onDelete}
                                />
                            </div>
                        )}
                    </div>

                    <h3 className="mt-2 truncate">
                        <button
                            type="button"
                            onClick={() => onEdit(workout)}
                            className="max-w-full cursor-pointer truncate rounded-sm text-left text-lg font-semibold text-white transition-colors hover:text-(--color-accent) focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            {workout.name}
                        </button>
                    </h3>

                    {workout.tags.length > 0 && (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                            {workout.tags.map((tag) => (
                                <li key={tag}>
                                    <button
                                        type="button"
                                        onClick={() => onTagClick(tag)}
                                        className="cursor-pointer rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                    >
                                        #{tag}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Numbers */}
                <dl className={cn("grid grid-cols-3 gap-3 border-y border-white/10 py-3", isList && "sm:w-80 sm:border-y-0 sm:py-0")}>
                    <Stat label="Exercises" value={String(workout.exercises.length)} />
                    <Stat label="Duration" value={`${workout.durationMin} min`} />
                    <Stat label="Volume" value={volume} />
                </dl>

                {/* Preview (grid only) */}
                {!isList && (
                    <ul className="flex-1 space-y-1.5">
                        {workout.exercises.slice(0, PREVIEW_COUNT).map((e) => (
                            <li key={e.id} className="flex items-baseline justify-between gap-3 text-xs">
                                <span className="truncate text-white/80">{e.name}</span>
                                <span className="shrink-0 text-(--color-text-muted) tabular-nums">
                                    {formatExercise(e, unitSystem)}
                                </span>
                            </li>
                        ))}
                        {hiddenCount > 0 && (
                            <li className="text-xs text-white/40">+{hiddenCount} more</li>
                        )}
                    </ul>
                )}

                {/* Footer / list actions */}
                <div className={cn("flex items-center justify-between gap-2", isList && "sm:w-64 sm:justify-end")}>
                    <p className="text-xs text-(--color-text-muted)">{lastPerformed}</p>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onLog(workout)}
                            className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-white/20 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            <IconPlayerPlay size={14} stroke={1.75} aria-hidden="true" />
                            Log
                        </button>

                        {isList && (
                            <>
                                <FavoriteButton workout={workout} onToggle={onToggleFavorite} />
                                <CardMenu
                                    workout={workout}
                                    onEdit={onEdit}
                                    onDuplicate={onDuplicate}
                                    onDelete={onDelete}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

function FavoriteButton({
    workout,
    onToggle,
}: {
    workout: Workout;
    onToggle: (workout: Workout) => void;
}) {
    const StarIcon = workout.favorite ? IconStarFilled : IconStar;

    return (
        <button
            type="button"
            onClick={() => onToggle(workout)}
            aria-pressed={workout.favorite}
            aria-label={workout.favorite ? `Unfavorite ${workout.name}` : `Favorite ${workout.name}`}
            className={cn(
                "cursor-pointer rounded-sm p-1.5 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                workout.favorite ? "text-(--color-accent)" : "text-white/40 hover:text-white",
            )}
        >
            <StarIcon size={18} stroke={1.5} aria-hidden="true" />
        </button>
    );
}

function CardMenu({
    workout,
    onEdit,
    onDuplicate,
    onDelete,
}: Pick<WorkoutCardProps, "workout" | "onEdit" | "onDuplicate" | "onDelete">) {
    return (
        <ActionMenu
            label={`Actions for ${workout.name}`}
            items={[
                { label: "Edit", icon: IconPencil, onClick: () => onEdit(workout) },
                { label: "Duplicate", icon: IconCopy, onClick: () => onDuplicate(workout) },
                { label: "Delete", icon: IconTrash, onClick: () => onDelete(workout), danger: true },
            ]}
        />
    );
}