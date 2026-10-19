import type { Icon } from "@tabler/icons-react";
import { IconBarbell, IconFlame, IconRun, IconYoga } from "@tabler/icons-react";
import type { WorkoutCategory, WorkoutSort } from "@/types/workout";

type CategoryConfig = {
    label: string;
    icon: Icon;
    /** top accent line on the card */
    bar: string;
    /** category label color */
    text: string;
};

export const CATEGORY_CONFIG: Record<WorkoutCategory, CategoryConfig> = {
    strength: { label: "Strength", icon: IconBarbell, bar: "bg-orange-400", text: "text-orange-400" },
    cardio: { label: "Cardio", icon: IconRun, bar: "bg-sky-400", text: "text-sky-400" },
    flexibility: { label: "Flexibility", icon: IconYoga, bar: "bg-emerald-400", text: "text-emerald-400" },
    hiit: { label: "HIIT", icon: IconFlame, bar: "bg-rose-400", text: "text-rose-400" },
};

export const WORKOUT_CATEGORIES = Object.keys(CATEGORY_CONFIG) as WorkoutCategory[];

export const SORT_OPTIONS: { value: WorkoutSort; label: string }[] = [
    { value: "recent", label: "Recently updated" },
    { value: "name", label: "Name A-Z" },
    { value: "exercises", label: "Most exercises" },
];

export const VIEW_OPTIONS = [
    { value: "grid", label: "Grid" },
    { value: "list", label: "List" },
] as const;

export type WorkoutView = (typeof VIEW_OPTIONS)[number]["value"];