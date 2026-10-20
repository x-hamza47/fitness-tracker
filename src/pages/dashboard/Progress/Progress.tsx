import { useState } from "react";
import { IconAlertTriangle, IconPlus } from "@tabler/icons-react";
import RangeTabs from "@/components/dashboard/RangeTabs";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Drawer from "@/components/ui/Drawer";
import { formatDayDate, todayISO } from "@/features/nutrition/nutrition.config";
import { PERFORMANCE_CONFIG, PROGRESS_RANGE_OPTIONS } from "@/features/progress/progress.config";
import {
    useCreateBodyEntry,
    useCreatePerformance,
    useDeleteBodyEntry,
    useDeletePerformance,
    useProgress,
    useUpdateBodyEntry,
    useUpdatePerformance,
} from "@/features/progress/useProgress";
import { useUiStore } from "@/stores/uiStore";
import type {
    BodyEntry,
    CreateBodyEntryPayload,
    CreatePerformancePayload,
    PerformanceEntry,
    ProgressRange,
} from "@/types/progress";
import BodyForm from "./components/BodyForm";
import BodyLog from "./components/BodyLog";
import PerformanceForm from "./components/PerformanceForm";
import PerformanceLog from "./components/PerformanceLog";
import ProgressSummary from "./components/ProgressSummary";
import TrendChart from "./components/TrendChart";

const BODY_FORM_ID = "body-form";
const PERFORMANCE_FORM_ID = "performance-form";

const PRIMARY_BUTTON =
    "flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-(--color-accent) px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const SECONDARY_BUTTON =
    "flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-white/20 px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:opacity-50";

/**
 * The drawers and dialog keep their last target while closing,
 * so the content doesn't vanish during the exit animation.
 */
type BodyEditor = { open: boolean; entry: BodyEntry | null; key: number };
type PerformanceEditor = { open: boolean; entry: PerformanceEntry | null; key: number };
type DeleteTarget =
    | { kind: "body"; entry: BodyEntry }
    | { kind: "performance"; entry: PerformanceEntry };
type DeleteState = { open: boolean; target: DeleteTarget | null };

export default function Progress() {
    const unitSystem = useUiStore((s) => s.unitSystem);
    const [range, setRange] = useState<ProgressRange>("90d");
    const { data, isLoading, isError, isFetching, refetch } = useProgress(range);

    const createBody = useCreateBodyEntry();
    const updateBody = useUpdateBodyEntry();
    const deleteBody = useDeleteBodyEntry();
    const createPerf = useCreatePerformance();
    const updatePerf = useUpdatePerformance();
    const deletePerf = useDeletePerformance();

    const [bodyEditor, setBodyEditor] = useState<BodyEditor>({ open: false, entry: null, key: 0 });
    const [perfEditor, setPerfEditor] = useState<PerformanceEditor>({ open: false, entry: null, key: 0 });
    const [deleting, setDeleting] = useState<DeleteState>({ open: false, target: null });

    const openBodyEditor = (entry: BodyEntry | null) => {
        createBody.reset();
        updateBody.reset();
        setBodyEditor((e) => ({ open: true, entry, key: e.key + 1 }));
    };
    const closeBodyEditor = () => setBodyEditor((e) => ({ ...e, open: false }));

    const openPerfEditor = (entry: PerformanceEntry | null) => {
        createPerf.reset();
        updatePerf.reset();
        setPerfEditor((e) => ({ open: true, entry, key: e.key + 1 }));
    };
    const closePerfEditor = () => setPerfEditor((e) => ({ ...e, open: false }));

    const openDelete = (target: DeleteTarget) => {
        deleteBody.reset();
        deletePerf.reset();
        setDeleting({ open: true, target });
    };

    const handleSaveBody = async (payload: CreateBodyEntryPayload) => {
        try {
            if (bodyEditor.entry) await updateBody.submitAsync({ id: bodyEditor.entry.id, payload });
            else await createBody.submitAsync(payload);
            closeBodyEditor();
        } catch {
            // The error is shown inside the form through errorMessage
        }
    };

    const handleSavePerf = async (payload: CreatePerformancePayload) => {
        try {
            if (perfEditor.entry) await updatePerf.submitAsync({ id: perfEditor.entry.id, payload });
            else await createPerf.submitAsync(payload);
            closePerfEditor();
        } catch {
            // The error is shown inside the form through errorMessage
        }
    };

    const handleDelete = async () => {
        const target = deleting.target;
        if (!target) return;
        try {
            if (target.kind === "body") await deleteBody.removeAsync(target.entry.id);
            else await deletePerf.removeAsync(target.entry.id);
            setDeleting((d) => ({ ...d, open: false }));
        } catch {
            // The error is shown inside the dialog through errorMessage
        }
    };

    const isSavingBody = createBody.isPending || updateBody.isPending;
    const isSavingPerf = createPerf.isPending || updatePerf.isPending;
    const isEditingBody = bodyEditor.entry !== null;
    const isEditingPerf = perfEditor.entry !== null;

    const target = deleting.target;
    const deleteMessage = !target
        ? ""
        : target.kind === "body"
          ? `Your check-in from ${formatDayDate(target.entry.date)} will be permanently removed. This can't be undone.`
          : `Your ${PERFORMANCE_CONFIG[target.entry.metric].label.toLowerCase()} record from ${formatDayDate(target.entry.date)} will be permanently removed. This can't be undone.`;
    const deleteError = !target
        ? null
        : target.kind === "body"
          ? deleteBody.errorMessage
          : deletePerf.errorMessage;

    let content;
    if (isLoading) {
        content = (
            <div aria-hidden="true" className="space-y-4">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                    ))}
                </div>
                <div className="h-96 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="h-64 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                    <div className="h-64 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                </div>
            </div>
        );
    } else if (isError || !data) {
        content = (
            <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-white/15 px-6 py-16 text-center">
                <IconAlertTriangle size={36} stroke={1.25} className="text-white/30" aria-hidden="true" />
                <h2 className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
                    Couldn't load your progress
                </h2>
                <p className="max-w-sm text-xs text-(--color-text-muted)">
                    Something went wrong while fetching your check-ins and records.
                </p>
                <button type="button" onClick={() => refetch()} className={PRIMARY_BUTTON}>
                    Try again
                </button>
            </div>
        );
    } else {
        content = (
            <div className="space-y-4">
                <ProgressSummary data={data} unitSystem={unitSystem} />
                <TrendChart data={data} unitSystem={unitSystem} isFetching={isFetching} />
                <div className="grid gap-4 lg:grid-cols-2">
                    <BodyLog
                        entries={data.body}
                        unitSystem={unitSystem}
                        onAdd={() => openBodyEditor(null)}
                        onEdit={openBodyEditor}
                        onDelete={(entry) => openDelete({ kind: "body", entry })}
                    />
                    <PerformanceLog
                        entries={data.performance}
                        unitSystem={unitSystem}
                        onAdd={() => openPerfEditor(null)}
                        onEdit={openPerfEditor}
                        onDelete={(entry) => openDelete({ kind: "performance", entry })}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Results</p>
                    <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Progress</h1>
                    <p className="mt-1 text-sm text-(--color-text-muted)">
                        Track your body and your performance over time.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => openPerfEditor(null)} className={SECONDARY_BUTTON}>
                        <IconPlus size={16} stroke={2} aria-hidden="true" />
                        Log record
                    </button>
                    <button type="button" onClick={() => openBodyEditor(null)} className={PRIMARY_BUTTON}>
                        <IconPlus size={16} stroke={2} aria-hidden="true" />
                        Log check-in
                    </button>
                </div>
            </header>

            <div className="flex justify-end">
                <RangeTabs label="Range" options={PROGRESS_RANGE_OPTIONS} value={range} onChange={setRange} />
            </div>

            {content}

            <Drawer
                open={bodyEditor.open}
                onClose={closeBodyEditor}
                title={isEditingBody ? "Edit check-in" : "Log check-in"}
                description="Record your weight and body measurements."
                footer={
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={closeBodyEditor} disabled={isSavingBody} className={SECONDARY_BUTTON}>
                            Cancel
                        </button>
                        <button type="submit" form={BODY_FORM_ID} disabled={isSavingBody} className={PRIMARY_BUTTON}>
                            {isSavingBody ? "Saving..." : isEditingBody ? "Save changes" : "Log check-in"}
                        </button>
                    </div>
                }
            >
                {/* key resets the form every time the drawer opens */}
                <BodyForm
                    key={bodyEditor.key}
                    formId={BODY_FORM_ID}
                    entry={bodyEditor.entry}
                    defaultDate={todayISO()}
                    unitSystem={unitSystem}
                    onSubmit={handleSaveBody}
                    errorMessage={isEditingBody ? updateBody.errorMessage : createBody.errorMessage}
                />
            </Drawer>

            <Drawer
                open={perfEditor.open}
                onClose={closePerfEditor}
                title={isEditingPerf ? "Edit record" : "Log record"}
                description="Save a lift, a run time or a rep count."
                footer={
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={closePerfEditor} disabled={isSavingPerf} className={SECONDARY_BUTTON}>
                            Cancel
                        </button>
                        <button type="submit" form={PERFORMANCE_FORM_ID} disabled={isSavingPerf} className={PRIMARY_BUTTON}>
                            {isSavingPerf ? "Saving..." : isEditingPerf ? "Save changes" : "Log record"}
                        </button>
                    </div>
                }
            >
                <PerformanceForm
                    key={perfEditor.key}
                    formId={PERFORMANCE_FORM_ID}
                    entry={perfEditor.entry}
                    defaultDate={todayISO()}
                    unitSystem={unitSystem}
                    onSubmit={handleSavePerf}
                    errorMessage={isEditingPerf ? updatePerf.errorMessage : createPerf.errorMessage}
                />
            </Drawer>

            <ConfirmDialog
                open={deleting.open}
                title={target?.kind === "performance" ? "Delete record?" : "Delete check-in?"}
                message={deleteMessage}
                isPending={deleteBody.isPending || deletePerf.isPending}
                errorMessage={deleteError}
                onConfirm={handleDelete}
                onCancel={() => setDeleting((d) => ({ ...d, open: false }))}
            />
        </div>
    );
}