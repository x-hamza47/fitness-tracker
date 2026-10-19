import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todayISO } from "@/features/nutrition/nutrition.config";
import {
    convertLength,
    convertLengthToCm,
    lengthUnit,
    MEASUREMENT_CONFIG,
} from "@/features/progress/progress.config";
import { convertWeight, convertWeightToKg, weightUnit } from "@/lib/units";
import { cn } from "@/lib/utils";
import { bodySchema, type BodyFormValues } from "@/schemas/progressSchema";
import type { UnitSystem } from "@/types/profile";
import {
    MEASUREMENT_KEYS,
    type BodyEntry,
    type CreateBodyEntryPayload,
    type Measurements,
} from "@/types/progress";
import { Field, INPUT } from "./Field";

type BodyFormProps = {
    /** Lets a button outside the form (the drawer footer) submit it */
    formId: string;
    /** Provide to edit, omit to create */
    entry?: BodyEntry | null;
    /** Used when creating */
    defaultDate: string;
    unitSystem: UnitSystem;
    onSubmit: (payload: CreateBodyEntryPayload) => void | Promise<void>;
    errorMessage?: string | null;
};

function toFormValues(entry: BodyEntry | null | undefined, defaultDate: string, unitSystem: UnitSystem): BodyFormValues {
    const measurements = entry?.measurements ?? {};
    const length = (cm: number | undefined) => (cm === undefined ? "" : String(convertLength(cm, unitSystem)));
    const kg = entry?.weightKg ?? null;

    return {
        date: entry?.date ?? defaultDate,
        weight: kg === null ? "" : String(convertWeight(kg, unitSystem)),
        chest: length(measurements.chest),
        waist: length(measurements.waist),
        hips: length(measurements.hips),
        biceps: length(measurements.biceps),
        thighs: length(measurements.thighs),
        notes: entry?.notes ?? "",
    };
}

export default function BodyForm({ formId, entry, defaultDate, unitSystem, onSubmit, errorMessage }: BodyFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BodyFormValues>({
        resolver: zodResolver(bodySchema),
        defaultValues: toFormValues(entry, defaultDate, unitSystem),
    });

    const submit = handleSubmit((values) => {
        const measurements: Measurements = {};
        for (const key of MEASUREMENT_KEYS) {
            const raw = values[key].trim();
            if (raw !== "") measurements[key] = convertLengthToCm(Number(raw), unitSystem);
        }

        const weight = values.weight.trim();

        return onSubmit({
            date: values.date,
            weightKg: weight === "" ? null : convertWeightToKg(Number(weight), unitSystem),
            measurements,
            notes: values.notes,
        });
    });

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
                        {...register("date")}
                        className={cn(INPUT, "[color-scheme:dark]")}
                    />
                </Field>
                <Field label={`Weight (${weightUnit(unitSystem)})`} error={errors.weight?.message}>
                    <input inputMode="decimal" placeholder="Optional" {...register("weight")} className={INPUT} />
                </Field>
            </div>

            <fieldset>
                <legend className="text-[10px] tracking-[0.2em] text-white/50 uppercase">
                    Measurements ({lengthUnit(unitSystem)}, all optional)
                </legend>
                <div className="mt-1.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {MEASUREMENT_KEYS.map((key) => (
                        <Field key={key} label={MEASUREMENT_CONFIG[key].label} error={errors[key]?.message}>
                            <input inputMode="decimal" placeholder="-" {...register(key)} className={INPUT} />
                        </Field>
                    ))}
                </div>
            </fieldset>

            <Field label="Notes (optional)" error={errors.notes?.message}>
                <textarea
                    {...register("notes")}
                    rows={2}
                    placeholder="Morning, after training, anything to remember"
                    className={cn(INPUT, "resize-none")}
                />
            </Field>
        </form>
    );
}