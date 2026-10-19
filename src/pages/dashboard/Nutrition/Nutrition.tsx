import { useState } from "react";
import { IconAlertTriangle, IconPlus } from "@tabler/icons-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Drawer from "@/components/ui/Drawer";
import { defaultMealTypeNow, MEAL_CONFIG, MEAL_TYPES, todayISO } from "@/features/nutrition/nutrition.config";
import {
    useCreateMeal,
    useDeleteMeal,
    useNutritionAnalytics,
    useNutritionDay,
    useUpdateMeal,
} from "@/features/nutrition/useNutrition";
import type { CreateMealPayload, Meal, MealType, NutritionRange } from "@/types/nutrition";
import DaySummary from "./components/DaySummary";
import DaySwitcher from "./components/DaySwitcher";
import MealForm from "./components/MealForm";
import MealSection from "./components/MealSection";
import NutritionAnalytics from "./components/NutritionAnalytics";

const FORM_ID = "meal-form";

const PRIMARY_BUTTON =
    "flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-(--color-accent) px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

/**
 * The drawer and dialog keep their last target while closing,
 * so the content doesn't vanish during the exit animation.
 */
type EditorState = { open: boolean; meal: Meal | null; mealType: MealType; key: number };
type DeleteState = { open: boolean; meal: Meal | null };

export default function Nutrition() {
    const [date, setDate] = useState(todayISO);
    const [range, setRange] = useState<NutritionRange>("30d");
    const [editor, setEditor] = useState<EditorState>({
        open: false,
        meal: null,
        mealType: "breakfast",
        key: 0,
    });
    const [deleting, setDeleting] = useState<DeleteState>({ open: false, meal: null });

    const { day, isLoading, isError, refetch } = useNutritionDay(date);
    const analytics = useNutritionAnalytics(range);
    const create = useCreateMeal();
    const update = useUpdateMeal();
    const del = useDeleteMeal();

    const openEditor = (meal: Meal | null, mealType: MealType) => {
        create.reset();
        update.reset();
        setEditor((e) => ({ open: true, meal, mealType, key: e.key + 1 }));
    };
    const closeEditor = () => setEditor((e) => ({ ...e, open: false }));

    const openDelete = (meal: Meal) => {
        del.reset();
        setDeleting({ open: true, meal });
    };

    const handleSave = async (payload: CreateMealPayload) => {
        try {
            if (editor.meal) await update.submitAsync({ id: editor.meal.id, payload });
            else await create.submitAsync(payload);
            closeEditor();
        } catch {
            // The error is shown inside the form through errorMessage
        }
    };

    const handleDelete = async () => {
        if (!deleting.meal) return;
        try {
            await del.removeAsync(deleting.meal.id);
            setDeleting((d) => ({ ...d, open: false }));
        } catch {
            // The error is shown inside the dialog through errorMessage
        }
    };

    const isSaving = create.isPending || update.isPending;
    const isEditing = editor.meal !== null;

    let content;
    if (isLoading) {
        content = (
            <div aria-hidden="true" className="space-y-4">
                <div className="h-40 animate-pulse rounded-sm border border-white/10 bg-white/[0.02]" />
                {MEAL_TYPES.map((t) => (
                    <div key={t} className="h-24 animate-pulse rounded-sm border border-white/10 bg-white/[0.02]" />
                ))}
            </div>
        );
    } else if (isError || !day) {
        content = (
            <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-white/15 px-6 py-16 text-center">
                <IconAlertTriangle size={36} stroke={1.25} className="text-white/30" aria-hidden="true" />
                <h2 className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
                    Couldn't load this day
                </h2>
                <p className="max-w-sm text-xs text-(--color-text-muted)">
                    Something went wrong while fetching your meals.
                </p>
                <button type="button" onClick={() => refetch()} className={PRIMARY_BUTTON}>
                    Try again
                </button>
            </div>
        );
    } else {
        content = (
            <div className="space-y-4">
                <DaySummary totals={day.totals} targets={day.targets} />
                {MEAL_TYPES.map((mealType) => (
                    <MealSection
                        key={mealType}
                        mealType={mealType}
                        meals={day.meals.filter((m) => m.mealType === mealType)}
                        onAdd={(type) => openEditor(null, type)}
                        onEdit={(meal) => openEditor(meal, meal.mealType)}
                        onDelete={openDelete}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Fuel</p>
                    <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Nutrition</h1>
                    <p className="mt-1 text-sm text-(--color-text-muted)">Log meals and watch your macros.</p>
                </div>
                <button
                    type="button"
                    onClick={() => openEditor(null, defaultMealTypeNow())}
                    className={PRIMARY_BUTTON}
                >
                    <IconPlus size={16} stroke={2} aria-hidden="true" />
                    Log meal
                </button>
            </header>

            <DaySwitcher date={date} onChange={setDate} />

            {content}

            <NutritionAnalytics
                analytics={analytics.analytics}
                range={range}
                onRangeChange={setRange}
                isLoading={analytics.isLoading}
                isError={analytics.isError}
                onRetry={() => analytics.refetch()}
            />

            <Drawer
                open={editor.open}
                onClose={closeEditor}
                title={isEditing ? "Edit meal" : "Log meal"}
                description={
                    isEditing
                        ? "Update the foods, calories and macros."
                        : "Add what you ate, with calories and macros."
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
                            {isSaving ? "Saving..." : isEditing ? "Save changes" : "Log meal"}
                        </button>
                    </div>
                }
            >
                {/* key resets the form every time the drawer opens */}
                <MealForm
                    key={editor.key}
                    formId={FORM_ID}
                    meal={editor.meal}
                    defaultMealType={editor.mealType}
                    date={date}
                    onSubmit={handleSave}
                    errorMessage={isEditing ? update.errorMessage : create.errorMessage}
                />
            </Drawer>

            <ConfirmDialog
                open={deleting.open}
                title="Delete meal?"
                message={`Your ${deleting.meal ? MEAL_CONFIG[deleting.meal.mealType].label.toLowerCase() : "meal"} entry will be permanently removed. This can't be undone.`}
                isPending={del.isPending}
                errorMessage={del.errorMessage}
                onConfirm={handleDelete}
                onCancel={() => setDeleting((d) => ({ ...d, open: false }))}
            />
        </div>
    );
}