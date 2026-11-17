import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "@/features/profile/useProfile";
import { convertLength, convertLengthToCm, lengthUnit } from "@/features/progress/progress.config";
import { convertWeight, convertWeightToKg, weightUnit } from "@/lib/units";
import { cn } from "@/lib/utils";
import {
    ACTIVITY_OPTIONS,
    fitnessSchema,
    GOAL_OPTIONS,
    SEX_OPTIONS,
    type FitnessValues,
} from "@/schemas/profileSchema";
import { useUiStore } from "@/stores/uiStore";
import type { UnitSystem, UserProfile } from "@/types/profile";
import { Field, INPUT, SELECT } from "@/pages/dashboard/Progress/components/Field";

const PRIMARY_BUTTON =
    "flex cursor-pointer items-center justify-center rounded-sm bg-(--color-accent) px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

function toFormValues(profile: UserProfile, unitSystem: UnitSystem): FitnessValues {
    const weight = (kg: number | null) => (kg === null ? "" : String(convertWeight(kg, unitSystem)));
    const height = profile.height === null ? "" : String(convertLength(profile.height, unitSystem));

    return {
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
        sex: profile.sex ?? "",
        height,
        weight: weight(profile.weight),
        targetWeight: weight(profile.targetWeight),
        goal: profile.goal ?? "",
        activityLevel: profile.activityLevel ?? "",
    };
}

export default function FitnessForm({ profile }: { profile: UserProfile }) {
    const unitSystem = useUiStore((s) => s.unitSystem);
    const { submitAsync, isPending, errorMessage } = useUpdateProfile();
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        reset: resetForm,
        formState: { errors, isDirty },
    } = useForm<FitnessValues>({
        resolver: zodResolver(fitnessSchema),
        defaultValues: toFormValues(profile, unitSystem),
    });

    useEffect(() => {
        resetForm(toFormValues(profile, unitSystem));
    }, [profile, unitSystem, resetForm]);

    const onSubmit = handleSubmit(async (values) => {
        const num = (raw: string, convert: (n: number) => number) =>
            raw.trim() === "" ? null : convert(Number(raw));

        try {
            await submitAsync({
                dateOfBirth: values.dateOfBirth === "" ? null : values.dateOfBirth,
                sex: values.sex === "" ? null : values.sex,
                height: num(values.height, (n) => convertLengthToCm(n, unitSystem)),
                weight: num(values.weight, (n) => convertWeightToKg(n, unitSystem)),
                targetWeight: num(values.targetWeight, (n) => convertWeightToKg(n, unitSystem)),
                goal: values.goal === "" ? null : values.goal,
                activityLevel: values.activityLevel === "" ? null : values.activityLevel,
            });
            resetForm(values);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch {
            // The error is shown below through errorMessage
        }
    });

    return (
        <section
            aria-label="Fitness details"
            className="rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm"
        >
            <h2 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">
                Fitness details
            </h2>
            <p className="mt-1 text-xs text-(--color-text-muted)">
                Used to personalize your dashboard and analytics.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Date of birth" error={errors.dateOfBirth?.message}>
                        <input
                            type="date"
                            {...register("dateOfBirth")}
                            className={cn(INPUT, "scheme-dark")}
                        />
                    </Field>
                    <Field label="Gender" error={errors.sex?.message}>
                        <select {...register("sex")} className={SELECT}>
                            <option value="">Not set</option>
                            {SEX_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <Field label={`Height (${lengthUnit(unitSystem)})`} error={errors.height?.message}>
                        <input inputMode="decimal" placeholder="Optional" {...register("height")} className={INPUT} />
                    </Field>
                    <Field label={`Weight (${weightUnit(unitSystem)})`} error={errors.weight?.message}>
                        <input inputMode="decimal" placeholder="Optional" {...register("weight")} className={INPUT} />
                    </Field>
                    <Field label={`Target weight (${weightUnit(unitSystem)})`} error={errors.targetWeight?.message}>
                        <input inputMode="decimal" placeholder="Optional" {...register("targetWeight")} className={INPUT} />
                    </Field>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Goal" error={errors.goal?.message}>
                        <select {...register("goal")} className={SELECT}>
                            <option value="">Not set</option>
                            {GOAL_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Activity level" error={errors.activityLevel?.message}>
                        <select {...register("activityLevel")} className={SELECT}>
                            <option value="">Not set</option>
                            {ACTIVITY_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                {errorMessage && (
                    <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {errorMessage}
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending || (!isDirty && !saved)}
                        className={cn(PRIMARY_BUTTON, saved && "bg-emerald-500 disabled:opacity-100")}
                    >
                        {isPending ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
                    </button>
                </div>
            </form>
        </section>
    );
}