import { useState } from "react";
import { IconAlertTriangle, IconBarbell, IconFilterOff, IconPlus } from "@tabler/icons-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Drawer from "@/components/ui/Drawer";
import {
    useCreateWorkout,
    useDeleteWorkout,
    useDuplicateWorkout,
    useToggleFavorite,
    useUpdateWorkout,
    useWorkouts,
} from "@/features/workouts/useWorkouts";
import type { WorkoutView } from "@/features/workouts/workout.config";
import { applyWorkoutFilters, getAllTags, getCategoryCounts } from "@/features/workouts/workoutFilters";
import { useUiStore } from "@/stores/uiStore";
import {
    DEFAULT_WORKOUT_FILTERS,
    type CreateWorkoutPayload,
    type Workout,
    type WorkoutFilters,
} from "@/types/workout";
import WorkoutCard from "./components/WorkoutCard";
import WorkoutForm from "./components/WorkoutForm";
import { StateMessage, WorkoutSkeletonGrid } from "./components/WorkoutStates";
import WorkoutToolbar from "./components/WorkoutToolbar";

const FORM_ID = "workout-form";

const PRIMARY_BUTTON =
    "flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-(--color-accent) px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

/**
 * The drawer and dialog keep their last target while closing,
 * so the content doesn't vanish during the exit animation.
 */
type EditorState = { open: boolean; workout: Workout | null; key: number };
type DeleteState = { open: boolean; workout: Workout | null };

export default function Workouts() {
    const unitSystem = useUiStore((s) => s.unitSystem);
    const { workouts, isLoading, isError, refetch } = useWorkouts();
    const create = useCreateWorkout();
    const update = useUpdateWorkout();
    const { toggle } = useToggleFavorite();
    const { duplicate } = useDuplicateWorkout();
    const del = useDeleteWorkout();

    const [filters, setFilters] = useState<WorkoutFilters>(DEFAULT_WORKOUT_FILTERS);
    const [view, setView] = useState<WorkoutView>("grid");
    const [editor, setEditor] = useState<EditorState>({ open: false, workout: null, key: 0 });
    const [deleting, setDeleting] = useState<DeleteState>({ open: false, workout: null });

    const all = workouts ?? [];
    const visible = applyWorkoutFilters(all, filters);
    const hasActiveFilters =
        filters.search !== "" || filters.category !== "all" || filters.tag !== null;

    const patchFilters = (patch: Partial<WorkoutFilters>) => setFilters((f) => ({ ...f, ...patch }));
    const clearFilters = () => setFilters((f) => ({ ...DEFAULT_WORKOUT_FILTERS, sort: f.sort }));

    const openEditor = (workout: Workout | null) => {
        create.reset();
        update.reset();
        setEditor((e) => ({ open: true, workout, key: e.key + 1 }));
    };
    const closeEditor = () => setEditor((e) => ({ ...e, open: false }));

    const handleSave = async (payload: CreateWorkoutPayload) => {
        try {
            if (editor.workout) await update.submitAsync({ id: editor.workout.id, payload });
            else await create.submitAsync(payload);
            closeEditor();
        } catch {
            // The error is shown inside the form through errorMessage
        }
    };

    const handleDelete = async () => {
        if (!deleting.workout) return;
        try {
            await del.removeAsync(deleting.workout.id);
            setDeleting((d) => ({ ...d, open: false }));
        } catch {
            // The error is shown inside the dialog through errorMessage
        }
    };

    const isSaving = create.isPending || update.isPending;
    const isEditing = editor.workout !== null;

    let content;
    if (isLoading) {
        content = <WorkoutSkeletonGrid />;
    } else if (isError) {
        content = (
            <StateMessage
                icon={IconAlertTriangle}
                title="Couldn't load your workouts"
                message="Something went wrong while fetching your routines."
                action={
                    <button type="button" onClick={() => refetch()} className={PRIMARY_BUTTON}>
                        Try again
                    </button>
                }
            />
        );
    } else if (all.length === 0) {
        content = (
            <StateMessage
                icon={IconBarbell}
                title="No routines yet"
                message="Build your first routine with exercises, sets, reps and weights."
                action={
                    <button type="button" onClick={() => openEditor(null)} className={PRIMARY_BUTTON}>
                        <IconPlus size={16} stroke={2} aria-hidden="true" />
                        Create routine
                    </button>
                }
            />
        );
    } else if (visible.length === 0) {
        content = (
            <StateMessage
                icon={IconFilterOff}
                title="No matching routines"
                message="Nothing matches your search and filters."
                action={
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="cursor-pointer rounded-sm border border-white/20 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        Clear filters
                    </button>
                }
            />
        );
    } else {
        content = (
            <div
                className={
                    view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3"
                }
            >
                {visible.map((workout) => (
                    <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        unitSystem={unitSystem}
                        view={view}
                        onEdit={openEditor}
                        onDuplicate={(w) => duplicate(w.id)}
                        onDelete={(w) => setDeleting({ open: true, workout: w })}
                        onToggleFavorite={(w) => toggle({ id: w.id, favorite: !w.favorite })}
                        onTagClick={(tag) => patchFilters({ tag })}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Training</p>
                    <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Workouts</h1>
                    <p className="mt-1 text-sm text-(--color-text-muted)">
                        {workouts
                            ? `${all.length} ${all.length === 1 ? "routine" : "routines"} in your library`
                            : "Your routine library"}
                    </p>
                </div>
                <button type="button" onClick={() => openEditor(null)} className={PRIMARY_BUTTON}>
                    <IconPlus size={16} stroke={2} aria-hidden="true" />
                    New routine
                </button>
            </header>

            {all.length > 0 && (
                <WorkoutToolbar
                    filters={filters}
                    onChange={patchFilters}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    counts={getCategoryCounts(all)}
                    tags={getAllTags(all)}
                    view={view}
                    onViewChange={setView}
                />
            )}

            {content}

            <Drawer
                open={editor.open}
                onClose={closeEditor}
                title={isEditing ? "Edit routine" : "New routine"}
                description={
                    isEditing
                        ? "Update exercises, sets, reps and weights."
                        : "Add the exercises you want in this routine."
                }
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={closeEditor}
                            disabled={isSaving}
                            className="cursor-pointer rounded-sm border border-white/15 px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button type="submit" form={FORM_ID} disabled={isSaving} className={PRIMARY_BUTTON}>
                            {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create routine"}
                        </button>
                    </div>
                }
            >
                {/* key resets the form every time the drawer opens */}
                <WorkoutForm
                    key={editor.key}
                    formId={FORM_ID}
                    workout={editor.workout}
                    unitSystem={unitSystem}
                    onSubmit={handleSave}
                    errorMessage={isEditing ? update.errorMessage : create.errorMessage}
                />
            </Drawer>

            <ConfirmDialog
                open={deleting.open}
                title="Delete routine?"
                message={`"${deleting.workout?.name ?? ""}" will be permanently removed. This can't be undone.`}
                isPending={del.isPending}
                errorMessage={del.errorMessage}
                onConfirm={handleDelete}
                onCancel={() => setDeleting((d) => ({ ...d, open: false }))}
            />
        </div>
    );
}