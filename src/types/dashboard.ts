
export type DateRange = "7d" | "30d" | "90d";

export const DATE_RANGES: { value: DateRange; label: string }[] = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
];

export type TrendDirection = "up" | "down" | "flat";


export type OverviewSummary = {
    workoutsThisWeek: number;
    workoutsWeeklyGoal: number;
    caloriesToday: number;
    caloriesTarget: number;
    currentWeightKg: number;
    weightChangeKg: number;
    streakDays: number;
    bestStreakDays: number;
};


export type WorkoutActivityPoint = {

    date: string;
    workouts: number;
    minutes: number;
};

export type MacroKey = "protein" | "carbs" | "fat";

export type MacroTotals = Record<MacroKey, number>;

export type NutritionToday = {
    calories: number;
    caloriesTarget: number;
    macros: MacroTotals;
    macroTargets: MacroTotals;
};


export type ProgressPoint = {
    date: string;
    weightKg: number;
};

export type WorkoutCategory = "strength" | "cardio" | "flexibility" | "hiit";

export type RecentWorkout = {
    id: string;
    name: string;
    category: WorkoutCategory;

    performedAt: string;
    durationMin: number;
    exerciseCount: number;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type RecentMeal = {
    id: string;
    name: string;
    mealType: MealType;
    loggedAt: string;
    calories: number;
    macros: MacroTotals;
};

export type GoalUnit = "kg" | "workouts" | "kcal" | "km";

export type Goal = {
    id: string;
    title: string;
    current: number;
    target: number;
    startValue?: number;
    unit: GoalUnit;
    dueDate?: string;
};
export type ActivityType =
    | "workout_completed"
    | "goal_achieved"
    | "new_follower"
    | "forum_reply";

export type ActivityItem = {
    id: string;
    type: ActivityType;
    message: string;
    createdAt: string;
    read: boolean;
};

export type Reminder = {
    id: string;
    title: string;
    at: string;
    kind: "workout" | "meal" | "goal";
};


export type OverviewData = {
    range: DateRange;
    summary: OverviewSummary;
    workoutActivity: WorkoutActivityPoint[];
    nutritionToday: NutritionToday;
    progressTrend: ProgressPoint[];
    recentWorkouts: RecentWorkout[];
    recentMeals: RecentMeal[];
    goals: Goal[];
    activity: ActivityItem[];
    reminders: Reminder[];
};