import { z } from "zod";

const GOALS = ["weight_loss", "muscle_gain", "maintenance", "endurance"] as const;
const SEXES = ["male", "female", "other"] as const;
const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "active", "very_active"] as const;

const optionalNumber = (label: string) =>
    z
        .string()
        .trim()
        .refine(
            (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) > 0 && Number(v) <= 1000),
            `${label} must be a positive number`,
        );

export const accountSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Use only letters, numbers and underscores"),
    bio: z.string().trim().max(200, "Bio must be at most 200 characters"),
});

export const fitnessSchema = z.object({
    dateOfBirth: z
        .string()
        .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Enter a valid date")
        .refine((v) => v === "" || new Date(v) <= new Date(), "Date can't be in the future"),
    sex: z.enum(["", ...SEXES]),
    height: optionalNumber("Height"),
    weight: optionalNumber("Weight"),
    targetWeight: optionalNumber("Target weight"),
    goal: z.enum(["", ...GOALS]),
    activityLevel: z.enum(["", ...ACTIVITY_LEVELS]),
});
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export const avatarSchema = z
    .instanceof(File, { message: "Please choose an image file." })
    .refine((f) => f.type.startsWith("image/"), "Please choose an image file.")
    .refine((f) => f.size <= MAX_AVATAR_BYTES, "Image is too large. Max 5 MB.");

export type AccountValues = z.infer<typeof accountSchema>;
export type FitnessValues = z.infer<typeof fitnessSchema>;

export const GOAL_OPTIONS = [
    { value: "weight_loss", label: "Weight loss" },
    { value: "muscle_gain", label: "Muscle gain" },
    { value: "maintenance", label: "Maintenance" },
    { value: "endurance", label: "Endurance" },
] as const;

export const SEX_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
] as const;

export const ACTIVITY_OPTIONS = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Light (1 to 3 days a week)" },
    { value: "moderate", label: "Moderate (3 to 5 days a week)" },
    { value: "active", label: "Active (6 to 7 days a week)" },
    { value: "very_active", label: "Very active (hard training daily)" },
] as const;