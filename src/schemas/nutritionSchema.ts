import { z } from "zod";

const nonNegative = (label: string) =>
    z
        .string()
        .trim()
        .refine((v) => v !== "" && Number.isFinite(Number(v)) && Number(v) >= 0, `${label}: enter 0 or more`);

const foodItemSchema = z.object({
    uid: z.string(),
    name: z.string().trim().min(1, "Enter a food name").max(80, "Keep it under 80 characters"),
    quantity: z
        .string()
        .trim()
        .refine((v) => v !== "" && Number.isFinite(Number(v)) && Number(v) > 0, "Must be above 0"),
    unit: z.enum(["g", "ml", "piece", "serving"]),
    calories: nonNegative("Calories"),
    protein: nonNegative("Protein"),
    carbs: nonNegative("Carbs"),
    fat: nonNegative("Fat"),
});

export const mealSchema = z.object({
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    notes: z.string().max(300, "Keep notes under 300 characters"),
    items: z.array(foodItemSchema).min(1, "Add at least one food"),
});

export type MealFormValues = z.infer<typeof mealSchema>;