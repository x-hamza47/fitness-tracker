import type { Activity, Goal, Sex } from "./types";

export const SEXES: { id: Sex; label: string }[] = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
];

export const GOALS: { id: Goal; label: string }[] = [
    { id: "lose", label: "Lose fat" },
    { id: "maintain", label: "Maintain" },
    { id: "build", label: "Build muscle" },
];

export const ACTIVITIES: { id: Activity; label: string; hint: string; factor: number; color: string }[] = [
    { id: "sedentary", label: "Sedentary", hint: "Desk job, little to no exercise", factor: 1.2, color: "#facc15" },
    { id: "light", label: "Light", hint: "Training 1-3 days a week", factor: 1.375, color: "#fb923c" },
    { id: "moderate", label: "Moderate", hint: "Training 3-5 days a week", factor: 1.55, color: "#ff6a00" },
    { id: "very", label: "Very active", hint: "Training 6-7 days a week", factor: 1.725, color: "#ef4444" },
];

export const MACRO_COLORS = {
    protein: "#ff6a00",
    carbs: "#facc15",
    fats: "#38bdf8",
};

export const GOAL_ADJUST: Record<Goal, number> = { lose: 0.85, maintain: 1, build: 1.1 };
export const PROTEIN_PER_KG: Record<Goal, number> = { lose: 2.0, maintain: 1.6, build: 1.8 };
export const FAT_SHARE = 0.25;