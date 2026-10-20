import type { ReactNode } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { MEAL_CONFIG, MEAL_TYPES, UNIT_OPTIONS } from "@/features/nutrition/nutrition.config";
import { cn } from "@/lib/utils";
import { mealSchema, type MealFormValues } from "@/schemas/nutritionSchema";
import type { CreateMealPayload, Meal, MealType } from "@/types/nutrition";

type MealFormProps = {
    /** Lets a button outside the form (the drawer footer) submit it */
    formId: string;
    /** Provide to edit, omit to create */
    meal?: Meal | null;
    /** Used when creating */
    defaultMealType: MealType;
    /** The day being viewed. New meals are logged on it. */
    date: string;
    onSubmit: (payload: CreateMealPayload) => void | Promise<void>;
    errorMessage?: string | null;
};

const INPUT =
    "mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";
const SELECT = `${INPUT} cursor-pointer [color-scheme:dark]`;
const LABEL = "text-[10px] tracking-[0.2em] text-white/50 uppercase";

const blankItem = () => ({
    uid: crypto.randomUUID(),
    name: "",
    quantity: "100",
    unit: "g" as const,
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
});

function toFormValues(meal: Meal | null | undefined, defaultMealType: MealType): MealFormValues {
    if (!meal) {
        return { mealType: defaultMealType, notes: "", items: [blankItem()] };
    }

    return {
        mealType: meal.mealType,
        notes: meal.notes,
        items: meal.items.map((i) => ({
            uid: i.id,
            name: i.name,
            quantity: String(i.quantity),
            unit: i.unit,
            calories: String(i.calories),
            protein: String(i.macros.protein),
            carbs: String(i.macros.carbs),
            fat: String(i.macros.fat),
        })),
    };
}

function Field({
    label,
    error,
    children,
    className,
}: {
    label: string;
    error?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="block">
                <span className={LABEL}>{label}</span>
                {children}
            </label>
            {error && (
                <p role="alert" className="mt-1 text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

const num = (v: string) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export default function MealForm({
    formId,
    meal,
    defaultMealType,
    date,
    onSubmit,
    errorMessage,
}: MealFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<MealFormValues>({
        resolver: zodResolver(mealSchema),
        defaultValues: toFormValues(meal, defaultMealType),
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const watchedItems = useWatch({ control, name: "items" });
    const totalKcal = Math.round((watchedItems ?? []).reduce((sum, i) => sum + num(i?.calories ?? ""), 0));

    const submit = handleSubmit((values) =>
        onSubmit({
            date: meal?.date ?? date,
            mealType: values.mealType,
            notes: values.notes,
            items: values.items.map((i) => ({
                id: i.uid,
                name: i.name,
                quantity: Number(i.quantity),
                unit: i.unit,
                calories: Number(i.calories),
                macros: {
                    protein: Number(i.protein),
                    carbs: Number(i.carbs),
                    fat: Number(i.fat),
                },
            })),
        }),
    );

    const itemsError = errors.items?.root?.message ?? errors.items?.message;

    return (
        <form id={formId} onSubmit={submit} noValidate className="space-y-6">
            {errorMessage && (
                <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {errorMessage}
                </p>
            )}

            <fieldset>
                <legend className={LABEL}>Meal</legend>
                <Controller
                    control={control}
                    name="mealType"
                    render={({ field }) => (
                        <div role="radiogroup" aria-label="Meal type" className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {MEAL_TYPES.map((value) => {
                                const { label, icon: MealIcon, text } = MEAL_CONFIG[value];
                                const active = field.value === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        role="radio"
                                        aria-checked={active}
                                        onClick={() => field.onChange(value)}
                                        className={cn(
                                            "flex cursor-pointer flex-col items-center gap-1.5 rounded-sm border px-2 py-3 text-[10px] tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                                            active
                                                ? "border-white/40 bg-white/10 text-white"
                                                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white",
                                        )}
                                    >
                                        <MealIcon size={20} stroke={1.5} className={active ? text : undefined} aria-hidden="true" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                />
            </fieldset>

            <fieldset>
                <legend className={LABEL}>Foods</legend>

                <ul className="mt-1.5 space-y-3">
                    {fields.map((field, index) => {
                        const rowErrors = errors.items?.[index];
                        return (
                            <li key={field.id} className="rounded-sm border border-white/10 bg-white/2 p-3">
                                <div className="flex items-start gap-2">
                                    <div className="min-w-0 flex-1 space-y-3">
                                        <Field label="Food" error={rowErrors?.name?.message}>
                                            <input
                                                {...register(`items.${index}.name`)}
                                                placeholder="e.g. Grilled chicken breast"
                                                autoComplete="off"
                                                className={INPUT}
                                            />
                                        </Field>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Quantity" error={rowErrors?.quantity?.message}>
                                                <input
                                                    inputMode="decimal"
                                                    {...register(`items.${index}.quantity`)}
                                                    className={INPUT}
                                                />
                                            </Field>
                                            <Field label="Unit" error={rowErrors?.unit?.message}>
                                                <select {...register(`items.${index}.unit`)} className={SELECT}>
                                                    {UNIT_OPTIONS.map((u) => (
                                                        <option key={u.value} value={u.value}>
                                                            {u.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            <Field label="Calories" error={rowErrors?.calories?.message}>
                                                <input
                                                    inputMode="decimal"
                                                    placeholder="kcal"
                                                    {...register(`items.${index}.calories`)}
                                                    className={INPUT}
                                                />
                                            </Field>
                                            <Field label="Protein (g)" error={rowErrors?.protein?.message}>
                                                <input
                                                    inputMode="decimal"
                                                    placeholder="0"
                                                    {...register(`items.${index}.protein`)}
                                                    className={INPUT}
                                                />
                                            </Field>
                                            <Field label="Carbs (g)" error={rowErrors?.carbs?.message}>
                                                <input
                                                    inputMode="decimal"
                                                    placeholder="0"
                                                    {...register(`items.${index}.carbs`)}
                                                    className={INPUT}
                                                />
                                            </Field>
                                            <Field label="Fat (g)" error={rowErrors?.fat?.message}>
                                                <input
                                                    inputMode="decimal"
                                                    placeholder="0"
                                                    {...register(`items.${index}.fat`)}
                                                    className={INPUT}
                                                />
                                            </Field>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                        aria-label={`Remove food ${index + 1}`}
                                        className="cursor-pointer rounded-sm p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40"
                                    >
                                        <IconTrash size={16} stroke={1.5} aria-hidden="true" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {itemsError && (
                    <p role="alert" className="mt-2 text-xs text-red-400">
                        {itemsError}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => append(blankItem())}
                    className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-white/20 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-white/60 uppercase transition-colors hover:border-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    <IconPlus size={16} stroke={1.5} aria-hidden="true" />
                    Add food
                </button>

                <p className="mt-3 text-right text-xs text-(--color-text-muted) tabular-nums">
                    Total: <span className="font-semibold text-white">{totalKcal} kcal</span>
                </p>
            </fieldset>

            <Field label="Notes (optional)" error={errors.notes?.message}>
                <textarea
                    {...register("notes")}
                    rows={2}
                    placeholder="Where you ate, how it felt, anything to remember"
                    className={cn(INPUT, "resize-none")}
                />
            </Field>
        </form>
    );
}