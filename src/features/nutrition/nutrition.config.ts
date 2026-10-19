import {
    IconApple,
    IconMoon,
    IconSun,
    IconSunrise,
    type Icon,
} from "@tabler/icons-react";
import type { MealType, NutritionRange, QuantityUnit } from "@/types/nutrition";

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export const MEAL_CONFIG: Record<MealType, { label: string; icon: Icon; text: string }> = {
    breakfast: { label: "Breakfast", icon: IconSunrise, text: "text-amber-300" },
    lunch: { label: "Lunch", icon: IconSun, text: "text-orange-300" },
    dinner: { label: "Dinner", icon: IconMoon, text: "text-indigo-300" },
    snack: { label: "Snacks", icon: IconApple, text: "text-emerald-300" },
};

export const UNIT_OPTIONS: { value: QuantityUnit; label: string }[] = [
    { value: "g", label: "g" },
    { value: "ml", label: "ml" },
    { value: "piece", label: "piece" },
    { value: "serving", label: "serving" },
];

export const NUTRITION_RANGE_OPTIONS: { value: NutritionRange; label: string }[] = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
];

/** Hex values because Recharts needs real colors, not Tailwind classes. */
export const MACRO_CONFIG = {
    protein: { label: "Protein", color: "#60a5fa", kcalPerGram: 4 },
    carbs: { label: "Carbs", color: "#fbbf24", kcalPerGram: 4 },
    fat: { label: "Fat", color: "#f87171", kcalPerGram: 9 },
} as const;

export const MACRO_KEYS = ["protein", "carbs", "fat"] as const;

/** Picks the meal the user is most likely logging right now. */
export function defaultMealTypeNow(): MealType {
    const hour = new Date().getHours();
    if (hour < 11) return "breakfast";
    if (hour < 16) return "lunch";
    if (hour < 19) return "snack";
    return "dinner";
}

/* ----------------------------- date helpers ----------------------------- */

export function toISODate(d: Date): string {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

export const todayISO = () => toISODate(new Date());

function parseISODate(iso: string): Date {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export function shiftDate(iso: string, days: number): string {
    const d = parseISODate(iso);
    d.setDate(d.getDate() + days);
    return toISODate(d);
}

export function formatDayLabel(iso: string): string {
    const today = todayISO();
    if (iso === today) return "Today";
    if (iso === shiftDate(today, -1)) return "Yesterday";
    return parseISODate(iso).toLocaleDateString("en", { weekday: "long" });
}

export function formatDayDate(iso: string): string {
    return parseISODate(iso).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
}

export function formatShortDate(iso: string): string {
    return parseISODate(iso).toLocaleDateString("en", { month: "short", day: "numeric" });
}