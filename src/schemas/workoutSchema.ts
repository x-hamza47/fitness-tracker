import { z } from "zod";

export const WORKOUT_CATEGORY_VALUES = ["strength", "cardio", "flexibility", "hiit"] as const;

const exerciseSchema = z.object({
    /** Stable key for the form row. It becomes the exercise id on submit. */
    uid: z.string(),
    name: z.string().trim().min(1, "Exercise name is required").max(60, "Max 60 characters"),
    sets: z.number({ error: "Required" }).int("Whole number").min(1, "Min 1").max(99, "Max 99"),
    reps: z.number({ error: "Required" }).int("Whole number").min(1, "Min 1").max(999, "Max 999"),
    /** Text on purpose: empty means bodyweight. Converted to kg on submit. */
    weight: z
        .string()
        .trim()
        .refine(
            (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 1000),
            "Invalid weight",
        ),
    notes: z.string().max(200, "Max 200 characters"),
});

export const workoutSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Max 60 characters"),
    category: z.enum(WORKOUT_CATEGORY_VALUES),
    durationMin: z
        .number({ error: "Required" })
        .int("Whole number")
        .min(1, "Min 1 minute")
        .max(600, "Max 600 minutes"),
    tags: z.array(z.string()).max(8, "Up to 8 tags"),
    exercises: z.array(exerciseSchema).min(1, "Add at least one exercise").max(30, "Max 30 exercises"),
    notes: z.string().max(500, "Max 500 characters"),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;