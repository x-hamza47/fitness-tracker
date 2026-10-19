import { z } from "zod";
import { todayISO } from "@/features/nutrition/nutrition.config";
import { parseDuration, PERFORMANCE_CONFIG } from "@/features/progress/progress.config";
import { PERFORMANCE_METRIC_KEYS } from "@/types/progress";

const dateField = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date")
    .refine((d) => d <= todayISO(), "Date can't be in the future");

/** Empty is allowed. If something is typed, it must be a number above 0. */
const optionalPositive = z
    .string()
    .trim()
    .refine((v) => v === "" || (Number.isFinite(Number(v)) && Number(v) > 0), "Enter a number above 0");

const notesField = z.string().max(300, "Keep notes under 300 characters");

export const bodySchema = z
    .object({
        date: dateField,
        weight: optionalPositive,
        chest: optionalPositive,
        waist: optionalPositive,
        hips: optionalPositive,
        biceps: optionalPositive,
        thighs: optionalPositive,
        notes: notesField,
    })
    .refine(
        (v) => [v.weight, v.chest, v.waist, v.hips, v.biceps, v.thighs].some((x) => x.trim() !== ""),
        { message: "Add your weight or at least one measurement", path: ["weight"] },
    );

export type BodyFormValues = z.infer<typeof bodySchema>;

export const performanceSchema = z
    .object({
        date: dateField,
        metric: z.enum(PERFORMANCE_METRIC_KEYS),
        value: z.string().trim(),
        notes: notesField,
    })
    .superRefine((v, ctx) => {
        const { kind } = PERFORMANCE_CONFIG[v.metric];

        if (kind === "time") {
            if (parseDuration(v.value) === null) {
                ctx.addIssue({ code: "custom", path: ["value"], message: "Use mm:ss, like 24:30" });
            }
            return;
        }

        const n = Number(v.value);
        if (kind === "reps") {
            if (v.value === "" || !Number.isInteger(n) || n <= 0) {
                ctx.addIssue({ code: "custom", path: ["value"], message: "Enter a whole number above 0" });
            }
            return;
        }

        if (v.value === "" || !Number.isFinite(n) || n <= 0) {
            ctx.addIssue({ code: "custom", path: ["value"], message: "Enter a number above 0" });
        }
    });

export type PerformanceFormValues = z.infer<typeof performanceSchema>;