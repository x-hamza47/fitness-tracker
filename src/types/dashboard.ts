
export type DateRange = "7d" | "30d" | "90d";

export const DATE_RANGES: { value: DateRange; label: string }[] = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
];

export type TrendDirection = "up" | "down" | "flat";

/** Summary numbers shown in the top stat cards. */
export type OverviewSummary = {
    workoutsThisWeek: number;
    workoutsWeeklyGoal: number;
    caloriesToday: number;
    caloriesTarget: number;
    /** always stored in kg, the UI converts using the unit preference */
    currentWeightKg: number;
    /** change over the selected range, in kg (negative = lost) */
    weightChangeKg: number;
    streakDays: number;
    bestStreakDays: number;
};

/** One point of the workout activity chart. */
export type WorkoutActivityPoint = {
    /** ISO date (yyyy-mm-dd) */
    date: string;
    workouts: number;
    minutes: number;
};

export type MacroKey = "protein" | "carbs" | "fat";

export type MacroTotals = Record<MacroKey, number>;

export type NutritionToday = {
    calories: number;
    caloriesTarget: number;
    /** grams eaten */
    macros: MacroTotals;
    /** grams targeted */
    macroTargets: MacroTotals;
};

/** One point of the progress trend chart. */
export type ProgressPoint = {
    /** ISO date (yyyy-mm-dd) */
    date: string;
    weightKg: number;
};

export type WorkoutCategory = "strength" | "cardio" | "flexibility" | "hiit";

export type RecentWorkout = {
    id: string;
    name: string;
    category: WorkoutCategory;
    /** ISO date-time */
    performedAt: string;
    durationMin: number;
    exerciseCount: number;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type RecentMeal = {
    id: string;
    name: string;
    mealType: MealType;
    /** ISO date-time */
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
    /** ISO date-time */
    createdAt: string;
    read: boolean;
};

export type Reminder = {
    id: string;
    title: string;
    /** ISO date-time */
    at: string;
    kind: "workout" | "meal" | "goal";
};

/** Everything the Overview page needs, returned by one request. */
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