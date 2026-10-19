import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todayISO } from "@/features/nutrition/nutrition.config";
import {
    formatDuration,
    parseDuration,
    PERFORMANCE_CONFIG,
    PERFORMANCE_OPTIONS,
} from "@/features/progress/progress.config";
import { convertWeight, convertWeightToKg, weightUnit } from "@/lib/units";
import { cn } from "@/lib/utils";
import { performanceSchema, type PerformanceFormValues } from "@/schemas/progressSchema";
import type { UnitSystem } from "@/types/profile";
import type { CreatePerformancePayload, PerformanceEntry } from "@/types/progress";
import { Field, INPUT, SELECT } from "./Field";

type PerformanceFormProps = {
    /** Lets a button outside the form (the drawer footer) submit it */
    formId: string;
    /** Provide to edit, omit to create */
    entry?: PerformanceEntry | null;
    /** Used when creating */
    defaultDate: string;
    unitSystem: UnitSystem;
    onSubmit: (payload: CreatePerformancePayload) => void | Promise<void>;
    errorMessage?: string | null;
};

function toFormValues(
    entry: PerformanceEntry | null | undefined,
    defaultDate: string,
    unitSystem: UnitSystem,
): PerformanceFormValues {
    if (!entry) {
        return { date: defaultDate, metric: "bench_press", value: "", notes: "" };
    }

    const { kind } = PERFORMANCE_CONFIG[entry.metric];
    const value =
        kind === "weight"
            ? String(convertWeight(entry.value, unitSystem))
            : kind === "time"
              ? formatDuration(entry.value)
              : String(entry.value);

    return { date: entry.date, metric: entry.metric, value, notes: entry.notes };
}

export default function PerformanceForm({
    formId,
    entry,
    defaultDate,
    unitSystem,
    onSubmit,
    errorMessage,
}: PerformanceFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PerformanceFormValues>({
        resolver: zodResolver(performanceSchema),
        defaultValues: toFormValues(entry, defaultDate, unitSystem),
    });

    // The value field changes its label and hint depending on the metric
    const metric = useWatch({ control, name: "metric" });
    const { kind } = PERFORMANCE_CONFIG[metric];

    const valueLabel =
        kind === "weight" ? `Weight (${weightUnit(unitSystem)})` : kind === "time" ? "Time (mm:ss)" : "Reps";
    const valuePlaceholder = kind === "time" ? "e.g. 24:30" : kind === "reps" ? "e.g. 10" : "e.g. 80";

    const submit = handleSubmit((values) => {
        const valueKind = PERFORMANCE_CONFIG[values.metric].kind;
        const value =
            valueKind === "weight"
                ? convertWeightToKg(Number(values.value), unitSystem)
                : valueKind === "time"
                  ? (parseDuration(values.value) ?? 0)
                  : Math.round(Number(values.value));

        return onSubmit({ date: values.date, metric: values.metric, value, notes: values.notes });
    });

    return (
        <form id={formId} onSubmit={submit} noValidate className="space-y-6">
            {errorMessage && (
                <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {errorMessage}
                </p>
            )}

            <Field label="Metric" error={errors.metric?.message}>
                <select {...register("metric")} className={SELECT}>
                    {PERFORMANCE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label={valueLabel} error={errors.value?.message}>
                    <input
                        inputMode={kind === "time" ? "text" : "decimal"}
                        placeholder={valuePlaceholder}
                        autoComplete="off"
                        {...register("value")}
                        className={INPUT}
                    />
                </Field>
                <Field label="Date" error={errors.date?.message}>
                    <input
                        type="date"
                        max={todayISO()}
                        {...register("date")}
                        className={cn(INPUT, "[color-scheme:dark]")}
                    />
                </Field>
            </div>

            <Field label="Notes (optional)" error={errors.notes?.message}>
                <textarea
                    {...register("notes")}
                    rows={2}
                    placeholder="Conditions, gear, how it felt"
                    className={cn(INPUT, "resize-none")}
                />
            </Field>
        </form>
    );
}