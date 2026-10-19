import { useState, type ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowDown, IconArrowUp, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { CATEGORY_CONFIG, WORKOUT_CATEGORIES } from "@/features/workouts/workout.config";
import { cn } from "@/lib/utils";
import { convertWeight, convertWeightToKg, weightUnit } from "@/lib/units";
import { workoutSchema, type WorkoutFormValues } from "@/schemas/workoutSchema";
import type { UnitSystem } from "@/types/profile";
import type { CreateWorkoutPayload, Workout } from "@/types/workout";

type WorkoutFormProps = {
    /** Lets a button outside the form (the drawer footer) submit it */
    formId: string;
    /** Provide to edit, omit to create */
    workout?: Workout | null;
    unitSystem: UnitSystem;
    onSubmit: (payload: CreateWorkoutPayload) => void | Promise<void>;
    errorMessage?: string | null;
};

const INPUT =
    "mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";
const LABEL = "text-[10px] tracking-[0.2em] text-white/50 uppercase";
const MAX_TAGS = 8;

const blankExercise = () => ({
    uid: crypto.randomUUID(),
    name: "",
    sets: 3,
    reps: 10,
    weight: "",
    notes: "",
});

function toFormValues(workout: Workout | null | undefined, unitSystem: UnitSystem): WorkoutFormValues {
    if (!workout) {
        return {
            name: "",
            category: "strength",
            durationMin: 45,
            tags: [],
            notes: "",
            exercises: [blankExercise()],
        };
    }

    return {
        name: workout.name,
        category: workout.category,
        durationMin: workout.durationMin,
        tags: workout.tags,
        notes: workout.notes,
        exercises: workout.exercises.map((e) => ({
            uid: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weightKg === null ? "" : String(convertWeight(e.weightKg, unitSystem)),
            notes: e.notes,
        })),
    };
}

function Field({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
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

function TagInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
    const [draft, setDraft] = useState("");

    const add = (raw: string) => {
        const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
        setDraft("");
        if (!tag || value.includes(tag) || value.length >= MAX_TAGS) return;
        onChange([...value, tag]);
    };

    return (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-sm border border-white/10 bg-white/[0.02] p-2 focus-within:ring-2 focus-within:ring-white">
            {value.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full border border-white/15 py-0.5 pr-1 pl-2.5 text-xs text-white/80"
                >
                    #{tag}
                    <button
                        type="button"
                        onClick={() => onChange(value.filter((t) => t !== tag))}
                        aria-label={`Remove tag ${tag}`}
                        className="cursor-pointer rounded-full p-0.5 text-white/50 hover:text-white"
                    >
                        <IconX size={12} stroke={2} aria-hidden="true" />
                    </button>
                </span>
            ))}
            <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        add(draft);
                    } else if (e.key === "Backspace" && !draft && value.length > 0) {
                        onChange(value.slice(0, -1));
                    }
                }}
                onBlur={() => add(draft)}
                placeholder={value.length === 0 ? "Type a tag and press Enter" : ""}
                aria-label="Add tag"
                className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
        </div>
    );
}

const iconButton =
    "cursor-pointer rounded-sm p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40";

export default function WorkoutForm({ formId, workout, unitSystem, onSubmit, errorMessage }: WorkoutFormProps) {
    const unit = weightUnit(unitSystem);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<WorkoutFormValues>({
        resolver: zodResolver(workoutSchema),
        defaultValues: toFormValues(workout, unitSystem),
    });

    const { fields, append, remove, move } = useFieldArray({ control, name: "exercises" });

    const submit = handleSubmit((values) =>
        onSubmit({
            name: values.name,
            category: values.category,
            durationMin: values.durationMin,
            tags: values.tags,
            notes: values.notes,
            exercises: values.exercises.map((e) => ({
                id: e.uid,
                name: e.name,
                sets: e.sets,
                reps: e.reps,
                weightKg: e.weight === "" ? null : convertWeightToKg(Number(e.weight), unitSystem),
                notes: e.notes,
            })),
        }),
    );

    const exercisesError = errors.exercises?.root?.message ?? errors.exercises?.message;

    return (
        <form id={formId} onSubmit={submit} noValidate className="space-y-6">
            {errorMessage && (
                <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {errorMessage}
                </p>
            )}

            <Field label="Routine name" error={errors.name?.message}>
                <input {...register("name")} placeholder="e.g. Push Day" autoComplete="off" className={INPUT} />
            </Field>

            <fieldset>
                <legend className={LABEL}>Category</legend>
                <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                        <div role="radiogroup" aria-label="Category" className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {WORKOUT_CATEGORIES.map((value) => {
                                const { label, icon: IconComponent, text } = CATEGORY_CONFIG[value];
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
                                        <IconComponent size={20} stroke={1.5} className={active ? text : undefined} aria-hidden="true" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                />
            </fieldset>

            <Field label="Planned duration (minutes)" error={errors.durationMin?.message}>
                <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    {...register("durationMin", { valueAsNumber: true })}
                    className={INPUT}
                />
            </Field>

            <fieldset>
                <legend className={LABEL}>Tags</legend>
                <Controller
                    control={control}
                    name="tags"
                    render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />}
                />
                {errors.tags?.message && (
                    <p role="alert" className="mt-1 text-xs text-red-400">
                        {errors.tags.message}
                    </p>
                )}
            </fieldset>

            <fieldset>
                <legend className={LABEL}>Exercises</legend>

                <ul className="mt-1.5 space-y-3">
                    {fields.map((field, index) => {
                        const rowErrors = errors.exercises?.[index];
                        return (
                            <li key={field.id} className="rounded-sm border border-white/10 bg-white/[0.02] p-3">
                                <div className="flex items-start gap-2">
                                    <span className="mt-2.5 w-5 shrink-0 text-center text-xs text-white/30 tabular-nums">
                                        {index + 1}
                                    </span>

                                    <div className="min-w-0 flex-1 space-y-3">
                                        <Field label="Exercise" error={rowErrors?.name?.message}>
                                            <input
                                                {...register(`exercises.${index}.name`)}
                                                placeholder="e.g. Barbell Bench Press"
                                                autoComplete="off"
                                                className={INPUT}
                                            />
                                        </Field>

                                        <div className="grid grid-cols-3 gap-3">
                                            <Field label="Sets" error={rowErrors?.sets?.message}>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    min={1}
                                                    {...register(`exercises.${index}.sets`, { valueAsNumber: true })}
                                                    className={INPUT}
                                                />
                                            </Field>
                                            <Field label="Reps" error={rowErrors?.reps?.message}>
                                                <input
                                                    type="number"
                                                    inputMode="numeric"
                                                    min={1}
                                                    {...register(`exercises.${index}.reps`, { valueAsNumber: true })}
                                                    className={INPUT}
                                                />
                                            </Field>
                                            <Field label={`Weight (${unit})`} error={rowErrors?.weight?.message}>
                                                <input
                                                    inputMode="decimal"
                                                    placeholder="Bodyweight"
                                                    {...register(`exercises.${index}.weight`)}
                                                    className={INPUT}
                                                />
                                            </Field>
                                        </div>

                                        <Field label="Notes (optional)" error={rowErrors?.notes?.message}>
                                            <input
                                                {...register(`exercises.${index}.notes`)}
                                                placeholder="Tempo, cues, rest time"
                                                className={INPUT}
                                            />
                                        </Field>
                                    </div>

                                    <div className="flex shrink-0 flex-col">
                                        <button
                                            type="button"
                                            onClick={() => move(index, index - 1)}
                                            disabled={index === 0}
                                            aria-label={`Move exercise ${index + 1} up`}
                                            className={iconButton}
                                        >
                                            <IconArrowUp size={16} stroke={1.5} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => move(index, index + 1)}
                                            disabled={index === fields.length - 1}
                                            aria-label={`Move exercise ${index + 1} down`}
                                            className={iconButton}
                                        >
                                            <IconArrowDown size={16} stroke={1.5} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            aria-label={`Remove exercise ${index + 1}`}
                                            className={cn(iconButton, "hover:text-red-400")}
                                        >
                                            <IconTrash size={16} stroke={1.5} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {exercisesError && (
                    <p role="alert" className="mt-2 text-xs text-red-400">
                        {exercisesError}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => append(blankExercise())}
                    className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-white/20 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-white/60 uppercase transition-colors hover:border-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    <IconPlus size={16} stroke={1.5} aria-hidden="true" />
                    Add exercise
                </button>
            </fieldset>

            <Field label="Routine notes (optional)" error={errors.notes?.message}>
                <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Anything to remember about this routine"
                    className={cn(INPUT, "resize-none")}
                />
            </Field>
        </form>
    );
}