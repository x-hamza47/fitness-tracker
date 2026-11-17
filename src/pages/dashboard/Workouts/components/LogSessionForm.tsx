import type { ReactNode } from "react";
import { useFieldArray, useForm, type Control, type UseFormRegister } from "react-hook-form";
import { IconPlus, IconX } from "@tabler/icons-react";
import { convertWeight, convertWeightToKg, weightUnit } from "@/lib/units";
import { cn } from "@/lib/utils";
import type { UnitSystem } from "@/types/profile";
import type { Workout } from "@/types/workout";
import type { LogWorkoutPayload } from "@/types/workoutLog";

type LogSessionFormProps = {
    formId: string;
    workout: Workout;
    unitSystem: UnitSystem;
    onSubmit: (payload: LogWorkoutPayload) => void | Promise<void>;
    errorMessage?: string | null;
};

type FormValues = {
    date: string;
    durationMin: number;
    notes: string;
    exercises: {
        name: string;
        notes: string;
        sets: { reps: number; weight: string }[];
    }[];
};

const INPUT =
    "mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 [color-scheme:dark] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";
const LABEL = "text-[10px] tracking-[0.2em] text-white/50 uppercase";

const todayISO = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

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

function SetRows({
    index,
    control,
    register,
    unit,
}: {
    index: number;
    control: Control<FormValues>;
    register: UseFormRegister<FormValues>;
    unit: string;
}) {
    const { fields, append, remove } = useFieldArray({ control, name: `exercises.${index}.sets` });

    return (
        <div className="space-y-2">
            {fields.map((field, setIndex) => (
                <div key={field.id} className="flex items-end gap-2">
                    <span className="w-6 pb-2.5 text-center text-xs text-white/30 tabular-nums">{setIndex + 1}</span>
                    <Field label="Reps" className="flex-1">
                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            {...register(`exercises.${index}.sets.${setIndex}.reps`, {
                                valueAsNumber: true,
                                validate: (v) => (Number.isInteger(v) && v >= 1) || "Min 1",
                            })}
                            className={INPUT}
                        />
                    </Field>
                    <Field label={`Weight (${unit})`} className="flex-1">
                        <input
                            inputMode="decimal"
                            placeholder="Bodyweight"
                            {...register(`exercises.${index}.sets.${setIndex}.weight`, {
                                validate: (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0) || "Invalid",
                            })}
                            className={INPUT}
                        />
                    </Field>
                    <button
                        type="button"
                        onClick={() => remove(setIndex)}
                        disabled={fields.length === 1}
                        aria-label={`Remove set ${setIndex + 1}`}
                        className="mb-1 cursor-pointer rounded-sm p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-red-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <IconX size={16} stroke={1.5} aria-hidden="true" />
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => {
                    const last = fields[fields.length - 1];
                    append({ reps: last?.reps ?? 10, weight: last?.weight ?? "" });
                }}
                className="flex cursor-pointer items-center gap-1.5 text-[10px] tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
                <IconPlus size={14} stroke={1.5} aria-hidden="true" />
                Add set
            </button>
        </div>
    );
}

export default function LogSessionForm({ formId, workout, unitSystem, onSubmit, errorMessage }: LogSessionFormProps) {
    const unit = weightUnit(unitSystem);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            date: todayISO(),
            durationMin: workout.durationMin,
            notes: "",
            exercises: workout.exercises.map((e) => ({
                name: e.name,
                notes: e.notes,
                sets: Array.from({ length: e.sets }, () => ({
                    reps: e.reps,
                    weight: e.weightKg === null ? "" : String(convertWeight(e.weightKg, unitSystem)),
                })),
            })),
        },
    });

    const { fields } = useFieldArray({ control, name: "exercises" });

    const submit = handleSubmit((values) =>
        onSubmit({
            workoutId: workout.id,
            performedAt: values.date === todayISO() ? new Date().toISOString() : new Date(values.date).toISOString(),
            durationMin: values.durationMin,
            notes: values.notes,
            exercises: values.exercises.map((e) => ({
                name: e.name,
                notes: e.notes,
                sets: e.sets.map((s) => ({
                    reps: s.reps,
                    weightKg: s.weight === "" ? null : convertWeightToKg(Number(s.weight), unitSystem),
                })),
            })),
        }),
    );

    return (
        <form id={formId} onSubmit={submit} noValidate className="space-y-6">
            {errorMessage && (
                <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {errorMessage}
                </p>
            )}

            <div className="grid grid-cols-2 gap-3">
                <Field label="Date" error={errors.date?.message}>
                    <input
                        type="date"
                        max={todayISO()}
                        {...register("date", { required: "Date is required" })}
                        className={INPUT}
                    />
                </Field>
                <Field label="Duration (min)" error={errors.durationMin?.message}>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        {...register("durationMin", {
                            valueAsNumber: true,
                            validate: (v) => (Number.isInteger(v) && v >= 0 && v <= 600) || "0 to 600",
                        })}
                        className={INPUT}
                    />
                </Field>
            </div>

            <ul className="space-y-4">
                {fields.map((field, index) => (
                    <li key={field.id} className={cn("rounded-sm border border-white/10 bg-white/2 p-3")}>
                        <h3 className="mb-3 text-sm font-semibold text-white">{field.name}</h3>
                        <SetRows index={index} control={control} register={register} unit={unit} />
                    </li>
                ))}
            </ul>

            <Field label="Session notes (optional)">
                <textarea
                    {...register("notes", { maxLength: { value: 1000, message: "Max 1000 characters" } })}
                    rows={3}
                    placeholder="How did it feel?"
                    className={cn(INPUT, "resize-none")}
                />
            </Field>
        </form>
    );
}