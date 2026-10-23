import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import ActionMenu from "@/components/ui/ActionMenu";
import { MEAL_CONFIG } from "@/features/nutrition/nutrition.config";
import { getItemsTotals, getMealsTotals, type Meal, type MealType } from "@/types/nutrition";

type MealSectionProps = {
    mealType: MealType;
    meals: Meal[];
    onAdd: (mealType: MealType) => void;
    onEdit: (meal: Meal) => void;
    onDelete: (meal: Meal) => void;
};

export default function MealSection({ mealType, meals, onAdd, onEdit, onDelete }: MealSectionProps) {
    const { label, icon: MealIcon, text } = MEAL_CONFIG[mealType];
    const kcal = Math.round(getMealsTotals(meals).calories);

    return (
        <section aria-label={label} className="rounded-xl border border-white/10 bg-white/3 backdrop-blur-md shadow-lg">
            <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2">
                    <MealIcon size={16} stroke={1.75} className={text} aria-hidden="true" />
                    <h2 className="text-[10px] font-semibold tracking-[0.2em] text-white uppercase">{label}</h2>
                    {kcal > 0 && (
                        <span className="text-xs text-(--color-text-muted) tabular-nums">{kcal} kcal</span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onAdd(mealType)}
                    aria-label={`Add ${label.toLowerCase()}`}
                    className="cursor-pointer rounded-sm p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    <IconPlus size={16} stroke={1.75} aria-hidden="true" />
                </button>
            </header>

            {meals.length === 0 ? (
                <p className="px-5 py-4 text-xs text-white/40">Nothing logged yet.</p>
            ) : (
                <ul className="divide-y divide-white/10">
                    {meals.map((meal) => {
                        const totals = getItemsTotals(meal.items);
                        return (
                            <li key={meal.id} className="px-5 py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-xs text-(--color-text-muted) tabular-nums">
                                        {Math.round(totals.calories)} kcal · P {Math.round(totals.macros.protein)} · C{" "}
                                        {Math.round(totals.macros.carbs)} · F {Math.round(totals.macros.fat)}
                                    </p>
                                    <div className="-mt-1.5 -mr-1.5">
                                        <ActionMenu
                                            label={`Actions for ${label.toLowerCase()}`}
                                            items={[
                                                { label: "Edit", icon: IconPencil, onClick: () => onEdit(meal) },
                                                {
                                                    label: "Delete",
                                                    icon: IconTrash,
                                                    onClick: () => onDelete(meal),
                                                    danger: true,
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>

                                <ul className="mt-2 space-y-1.5">
                                    {meal.items.map((item) => (
                                        <li key={item.id} className="flex items-baseline justify-between gap-3 text-sm">
                                            <span className="truncate text-white/90">
                                                {item.name}
                                                <span className="ml-2 text-xs text-white/40">
                                                    {item.quantity} {item.unit}
                                                </span>
                                            </span>
                                            <span className="shrink-0 text-xs text-(--color-text-muted) tabular-nums">
                                                {item.calories} kcal
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {meal.notes && <p className="mt-2 text-xs text-white/40 italic">{meal.notes}</p>}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}