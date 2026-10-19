export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type QuantityUnit = "g" | "ml" | "piece" | "serving";

export type Macros = {
    protein: number;
    carbs: number;
    fat: number;
};

/** One food in a meal. Calories and macros are totals for the quantity entered, not per 100 g. */
export type FoodItem = {
    id: string;
    name: string;
    quantity: number;
    unit: QuantityUnit;
    calories: number;
    macros: Macros;
};

export type Meal = {
    id: string;
    /** Local calendar day, YYYY-MM-DD */
    date: string;
    mealType: MealType;
    items: FoodItem[];
    notes: string;
    /** ISO date-time */
    createdAt: string;
    /** ISO date-time */
    updatedAt: string;
};

/** What the form sends when logging a meal. The server fills in the rest. */
export type CreateMealPayload = {
    date: string;
    mealType: MealType;
    items: FoodItem[];
    notes: string;
};

export type UpdateMealPayload = Partial<CreateMealPayload>;

export type NutritionTotals = {
    calories: number;
    macros: Macros;
};

export type NutritionTargets = {
    calories: number;
    macros: Macros;
};

/** Everything the Nutrition page needs for one selected day. */
export type NutritionDay = {
    date: string;
    meals: Meal[];
    totals: NutritionTotals;
    targets: NutritionTargets;
};

export type NutritionRange = "7d" | "30d" | "90d";

export type NutritionTrendPoint = {
    /** YYYY-MM-DD */
    date: string;
    calories: number;
    macros: Macros;
};

export type NutritionAnalytics = {
    range: NutritionRange;
    targets: NutritionTargets;
    /** One point per day, oldest first. Days with no logs have zeros. */
    trend: NutritionTrendPoint[];
    /** Average over days that have at least one log */
    averages: NutritionTotals;
    /** Days with at least one meal logged */
    loggedDays: number;
};

export const EMPTY_MACROS: Macros = { protein: 0, carbs: 0, fat: 0 };

export function sumMacros(a: Macros, b: Macros): Macros {
    return {
        protein: a.protein + b.protein,
        carbs: a.carbs + b.carbs,
        fat: a.fat + b.fat,
    };
}

/** Totals for a list of food items. */
export function getItemsTotals(items: Pick<FoodItem, "calories" | "macros">[]): NutritionTotals {
    return items.reduce<NutritionTotals>(
        (sum, item) => ({
            calories: sum.calories + item.calories,
            macros: sumMacros(sum.macros, item.macros),
        }),
        { calories: 0, macros: EMPTY_MACROS },
    );
}

/** Totals for a list of meals, such as everything eaten in a day. */
export function getMealsTotals(meals: Pick<Meal, "items">[]): NutritionTotals {
    return getItemsTotals(meals.flatMap((m) => m.items));
}