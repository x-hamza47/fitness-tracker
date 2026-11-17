export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type QuantityUnit = "g" | "ml" | "piece" | "serving";

export type Macros = {
    protein: number;
    carbs: number;
    fat: number;
};


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
    
    date: string;
    mealType: MealType;
    items: FoodItem[];
    notes: string;
    
    createdAt: string;
    
    updatedAt: string;
};


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


export type NutritionDay = {
    date: string;
    meals: Meal[];
    totals: NutritionTotals;
    targets: NutritionTargets;
};

export type NutritionRange = "7d" | "30d" | "90d";

export type NutritionTrendPoint = {
    
    date: string;
    calories: number;
    macros: Macros;
};

export type NutritionAnalytics = {
    range: NutritionRange;
    targets: NutritionTargets;
    
    trend: NutritionTrendPoint[];
    
    averages: NutritionTotals;
    
    loggedDays: number;
};

export type NutritionPlan = {
    calories: number;
    macros: Macros;
    waterMl: number;
    waterLiters: number;
    recommendedWorkoutsPerWeek: number;
    recommendedCategories: string[];
    estimatedWeeklyWeightChange: number;
    estimatedTargetDate: string | null;
    tips: string[];
    missingFields: string[];
};

export const EMPTY_MACROS: Macros = { protein: 0, carbs: 0, fat: 0 };

export function sumMacros(a: Macros, b: Macros): Macros {
    return {
        protein: a.protein + b.protein,
        carbs: a.carbs + b.carbs,
        fat: a.fat + b.fat,
    };
}


export function getItemsTotals(items: Pick<FoodItem, "calories" | "macros">[]): NutritionTotals {
    return items.reduce<NutritionTotals>(
        (sum, item) => ({
            calories: sum.calories + item.calories,
            macros: sumMacros(sum.macros, item.macros),
        }),
        { calories: 0, macros: EMPTY_MACROS },
    );
}


export function getMealsTotals(meals: Pick<Meal, "items">[]): NutritionTotals {
    return getItemsTotals(meals.flatMap((m) => m.items));
}