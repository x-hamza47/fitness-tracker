import type {
    ActivityItem,
    DateRange,
    Goal,
    OverviewData,
    ProgressPoint,
    RecentMeal,
    RecentWorkout,
    Reminder,
    WorkoutActivityPoint,
} from "@/types/dashboard";
import type {
    CreateWorkoutPayload,
    Exercise,
    UpdateWorkoutPayload,
    Workout,
} from "@/types/workout";
import {
    getMealsTotals,
    type CreateMealPayload,
    type FoodItem,
    type Macros,
    type Meal,
    type MealType,
    type NutritionAnalytics,
    type NutritionDay,
    type NutritionRange,
    type NutritionTargets,
    type NutritionTrendPoint,
    type QuantityUnit,
    type UpdateMealPayload,
} from "@/types/nutrition";
import {
    PERFORMANCE_METRIC_KEYS,
    type BodyEntry,
    type CreateBodyEntryPayload,
    type CreatePerformancePayload,
    type Measurements,
    type PerformanceEntry,
    type PerformanceMetricKey,
    type ProgressData,
    type ProgressRange,
    type UpdateBodyEntryPayload,
    type UpdatePerformancePayload,
} from "@/types/progress";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* -------------------------------------------------------------------------- */
/*  MOCK DATA: delete everything down to the service function when the API    */
/*  is ready.                                                                  */
/* -------------------------------------------------------------------------- */

const RANGE_DAYS: Record<DateRange, number> = { "7d": 7, "30d": 30, "90d": 90 };

function daysAgo(n: number): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d;
}

function toISODate(d: Date): string {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

/** Deterministic random, so the same day always gets the same value and charts don't jump on refetch. */
function seeded(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function workoutsOn(offset: number): { workouts: number; minutes: number } {
    const rand = seeded(offset * 7919 + 13);
    const r = rand();
    const workouts = r < 0.35 ? 0 : r < 0.85 ? 1 : 2;
    const minutes = workouts === 0 ? 0 : Math.round((30 + rand() * 40) * workouts);
    return { workouts, minutes };
}

function weightOn(offset: number): number {
    const noise = seeded(offset * 104729 + 7)() - 0.5;
    return round1(78.4 + offset * 0.04 + noise * 0.4);
}

function buildActivity(days: number): WorkoutActivityPoint[] {
    return Array.from({ length: days }, (_, i) => {
        const offset = days - 1 - i;
        return { date: toISODate(daysAgo(offset)), ...workoutsOn(offset) };
    });
}

function buildProgress(days: number): ProgressPoint[] {
    return Array.from({ length: days }, (_, i) => {
        const offset = days - 1 - i;
        return { date: toISODate(daysAgo(offset)), weightKg: weightOn(offset) };
    });
}

const RECENT_WORKOUTS: RecentWorkout[] = [
    { id: "w1", name: "Push Day", category: "strength", performedAt: hoursAgo(5), durationMin: 62, exerciseCount: 7 },
    { id: "w2", name: "5K Easy Run", category: "cardio", performedAt: hoursAgo(30), durationMin: 34, exerciseCount: 1 },
    { id: "w3", name: "Leg Day", category: "strength", performedAt: hoursAgo(76), durationMin: 70, exerciseCount: 8 },
    { id: "w4", name: "Tabata Burner", category: "hiit", performedAt: hoursAgo(100), durationMin: 25, exerciseCount: 6 },
    { id: "w5", name: "Mobility Flow", category: "flexibility", performedAt: hoursAgo(125), durationMin: 30, exerciseCount: 9 },
];

const RECENT_MEALS: RecentMeal[] = [
    { id: "m1", name: "Oats with banana and whey", mealType: "breakfast", loggedAt: hoursAgo(8), calories: 520, macros: { protein: 38, carbs: 68, fat: 12 } },
    { id: "m2", name: "Chicken rice bowl", mealType: "lunch", loggedAt: hoursAgo(4), calories: 710, macros: { protein: 52, carbs: 82, fat: 16 } },
    { id: "m3", name: "Greek yogurt and almonds", mealType: "snack", loggedAt: hoursAgo(2), calories: 240, macros: { protein: 22, carbs: 14, fat: 11 } },
    { id: "m4", name: "Salmon with veggies", mealType: "dinner", loggedAt: hoursAgo(26), calories: 640, macros: { protein: 46, carbs: 40, fat: 28 } },
];

const GOALS: Goal[] = [
    { id: "g1", title: "Reach 75 kg", current: 78.4, target: 75, startValue: 82, unit: "kg", dueDate: toISODate(daysAgo(-60)) },
    { id: "g2", title: "Workouts this week", current: 4, target: 5, unit: "workouts" },
    { id: "g3", title: "Run 40 km this month", current: 26, target: 40, unit: "km" },
];

const ACTIVITY: ActivityItem[] = [
    { id: "a1", type: "workout_completed", message: "You completed Push Day.", createdAt: hoursAgo(5), read: false },
    { id: "a2", type: "new_follower", message: "Sara Khan started following you.", createdAt: hoursAgo(9), read: false },
    { id: "a3", type: "goal_achieved", message: "Goal reached: 10 workouts in 14 days.", createdAt: hoursAgo(28), read: false },
    { id: "a4", type: "forum_reply", message: "Ali replied to your post in Strength Training.", createdAt: hoursAgo(52), read: true },
];

const REMINDERS: Reminder[] = [
    { id: "r1", title: "Pull Day", at: hoursAhead(16), kind: "workout" },
    { id: "r2", title: "Log lunch", at: hoursAhead(3), kind: "meal" },
    { id: "r3", title: "Weekly weigh-in", at: hoursAhead(40), kind: "goal" },
];

function buildOverview(range: DateRange): OverviewData {
    const days = RANGE_DAYS[range];
    const progressTrend = buildProgress(days);
    const thisWeek = buildActivity(7);

    return {
        range,
        summary: {
            workoutsThisWeek: thisWeek.reduce((sum, p) => sum + p.workouts, 0),
            workoutsWeeklyGoal: 5,
            caloriesToday: 1720,
            caloriesTarget: 2400,
            currentWeightKg: progressTrend[progressTrend.length - 1].weightKg,
            weightChangeKg: round1(
                progressTrend[progressTrend.length - 1].weightKg - progressTrend[0].weightKg,
            ),
            streakDays: 6,
            bestStreakDays: 14,
        },
        workoutActivity: buildActivity(days),
        nutritionToday: {
            calories: 1720,
            caloriesTarget: 2400,
            macros: { protein: 112, carbs: 190, fat: 48 },
            macroTargets: { protein: 160, carbs: 260, fat: 70 },
        },
        progressTrend,
        recentWorkouts: RECENT_WORKOUTS,
        recentMeals: RECENT_MEALS,
        goals: GOALS,
        activity: ACTIVITY,
        reminders: REMINDERS,
    };
}

/* -------------------------------------------------------------------------- */
/*  SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

export async function getOverview(range: DateRange): Promise<OverviewData> {
    // --- REAL API ---
    // const { data } = await api.get<OverviewData>("/users/me/overview", {
    //     params: { range },
    // });
    // return data;

    await wait(800);
    return buildOverview(range);
}


/* -------------------------------------------------------------------------- */
/*  WORKOUTS                                                                   */
/* -------------------------------------------------------------------------- */

/* ---- MOCK DATA: delete this block when the API is ready ---- */

const daysAgoISO = (d: number) => hoursAgo(d * 24);

const newId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const ex = (
    id: string,
    name: string,
    sets: number,
    reps: number,
    weightKg: number | null,
    notes = "",
): Exercise => ({ id, name, sets, reps, weightKg, notes });

/** Module scope, so create, edit and delete persist until a page refresh. */
let mockWorkouts: Workout[] = [
    {
        id: "wk1",
        name: "Push Day",
        category: "strength",
        tags: ["chest", "shoulders", "triceps"],
        durationMin: 65,
        notes: "Focus on slow negatives on bench.",
        favorite: true,
        createdAt: daysAgoISO(60),
        updatedAt: daysAgoISO(3),
        lastPerformedAt: hoursAgo(5),
        exercises: [
            ex("e1", "Barbell Bench Press", 4, 8, 80, "Pause on chest"),
            ex("e2", "Overhead Press", 3, 10, 40),
            ex("e3", "Incline Dumbbell Press", 3, 10, 28),
            ex("e4", "Lateral Raise", 4, 15, 10),
            ex("e5", "Triceps Pushdown", 3, 12, 30),
        ],
    },
    {
        id: "wk2",
        name: "Pull Day",
        category: "strength",
        tags: ["back", "biceps"],
        durationMin: 60,
        notes: "",
        favorite: false,
        createdAt: daysAgoISO(60),
        updatedAt: daysAgoISO(10),
        lastPerformedAt: daysAgoISO(3),
        exercises: [
            ex("e6", "Deadlift", 3, 5, 120),
            ex("e7", "Pull-ups", 4, 8, null, "Add weight when 4x10"),
            ex("e8", "Barbell Row", 3, 10, 60),
            ex("e9", "Face Pull", 3, 15, 20),
            ex("e10", "Hammer Curl", 3, 12, 16),
        ],
    },
    {
        id: "wk3",
        name: "Leg Day",
        category: "strength",
        tags: ["legs", "glutes"],
        durationMin: 70,
        notes: "",
        favorite: true,
        createdAt: daysAgoISO(55),
        updatedAt: daysAgoISO(12),
        lastPerformedAt: daysAgoISO(3),
        exercises: [
            ex("e11", "Back Squat", 4, 6, 100),
            ex("e12", "Romanian Deadlift", 3, 8, 80),
            ex("e13", "Leg Press", 3, 12, 180),
            ex("e14", "Walking Lunge", 3, 12, 20),
            ex("e15", "Calf Raise", 4, 15, 60),
        ],
    },
    {
        id: "wk4",
        name: "5K Easy Run",
        category: "cardio",
        tags: ["running", "endurance"],
        durationMin: 35,
        notes: "Keep heart rate in zone 2.",
        favorite: false,
        createdAt: daysAgoISO(40),
        updatedAt: daysAgoISO(40),
        lastPerformedAt: daysAgoISO(1),
        exercises: [ex("e16", "Easy Run", 1, 1, null, "5 km at conversational pace")],
    },
    {
        id: "wk5",
        name: "Tabata Burner",
        category: "hiit",
        tags: ["fat-loss", "conditioning"],
        durationMin: 25,
        notes: "20s on, 10s off.",
        favorite: false,
        createdAt: daysAgoISO(30),
        updatedAt: daysAgoISO(30),
        lastPerformedAt: daysAgoISO(4),
        exercises: [
            ex("e17", "Burpees", 8, 10, null),
            ex("e18", "Mountain Climbers", 8, 20, null),
            ex("e19", "Kettlebell Swing", 8, 15, 16),
            ex("e20", "Jump Squats", 8, 12, null),
        ],
    },
    {
        id: "wk6",
        name: "Mobility Flow",
        category: "flexibility",
        tags: ["mobility", "recovery"],
        durationMin: 30,
        notes: "Great for rest days.",
        favorite: false,
        createdAt: daysAgoISO(20),
        updatedAt: daysAgoISO(20),
        lastPerformedAt: daysAgoISO(5),
        exercises: [
            ex("e21", "Cat-Cow", 2, 10, null),
            ex("e22", "World's Greatest Stretch", 2, 8, null),
            ex("e23", "Pigeon Pose", 2, 1, null, "Hold 60 seconds per side"),
            ex("e24", "Hip 90/90", 2, 8, null),
        ],
    },
];

const notFound = () => ({
    isAxiosError: true,
    response: { status: 404, data: { message: "Workout not found." } },
});

/* ---- SERVICE ---- */

export async function getWorkouts(): Promise<Workout[]> {
    // --- REAL API ---
    // const { data } = await api.get<Workout[]>("/users/me/workouts");
    // return data;

    await wait(600);
    return mockWorkouts;
}

export async function createWorkout(payload: CreateWorkoutPayload): Promise<Workout> {
    // --- REAL API ---
    // const { data } = await api.post<Workout>("/users/me/workouts", payload);
    // return data;

    await wait(500);
    const now = new Date().toISOString();
    const workout: Workout = {
        ...payload,
        id: newId(),
        favorite: false,
        createdAt: now,
        updatedAt: now,
        lastPerformedAt: null,
    };
    mockWorkouts = [workout, ...mockWorkouts];
    return workout;
}

export async function updateWorkout(
    id: string,
    payload: UpdateWorkoutPayload,
): Promise<Workout> {
    // --- REAL API ---
    // const { data } = await api.patch<Workout>(`/users/me/workouts/${id}`, payload);
    // return data;

    await wait(400);
    const current = mockWorkouts.find((w) => w.id === id);
    if (!current) throw notFound();

    const updated: Workout = { ...current, ...payload, updatedAt: new Date().toISOString() };
    mockWorkouts = mockWorkouts.map((w) => (w.id === id ? updated : w));
    return updated;
}

export async function duplicateWorkout(id: string): Promise<Workout> {
    // --- REAL API ---
    // const { data } = await api.post<Workout>(`/users/me/workouts/${id}/duplicate`);
    // return data;

    await wait(400);
    const source = mockWorkouts.find((w) => w.id === id);
    if (!source) throw notFound();

    const now = new Date().toISOString();
    const copy: Workout = {
        ...source,
        id: newId(),
        name: `${source.name} (copy)`,
        exercises: source.exercises.map((e) => ({ ...e, id: newId() })),
        favorite: false,
        createdAt: now,
        updatedAt: now,
        lastPerformedAt: null,
    };
    mockWorkouts = [copy, ...mockWorkouts];
    return copy;
}

export async function deleteWorkout(id: string): Promise<void> {
    // --- REAL API ---
    // await api.delete(`/users/me/workouts/${id}`);

    await wait(400);
    mockWorkouts = mockWorkouts.filter((w) => w.id !== id);
}





/* -------------------------------------------------------------------------- */
/*  NUTRITION                                                                  */
/* -------------------------------------------------------------------------- */

/* ---- MOCK DATA: delete this block when the API is ready ---- */

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

/** Chance that a given meal gets logged on a given day. */
const LOG_CHANCE: Record<MealType, number> = {
    breakfast: 0.85,
    lunch: 0.9,
    dinner: 0.9,
    snack: 0.6,
};

/** Hour of day each meal is "eaten", used for timestamps. */
const MEAL_HOUR: Record<MealType, number> = {
    breakfast: 8,
    lunch: 13,
    dinner: 20,
    snack: 16,
};

const MOCK_TARGETS: NutritionTargets = {
    calories: 2400,
    macros: { protein: 160, carbs: 260, fat: 70 },
};

type FoodTemplate = Omit<FoodItem, "id">;

const food = (
    name: string,
    quantity: number,
    unit: QuantityUnit,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
): FoodTemplate => ({ name, quantity, unit, calories, macros: { protein, carbs, fat } });

const MEAL_TEMPLATES: Record<MealType, FoodTemplate[][]> = {
    breakfast: [
        [
            food("Rolled oats", 60, "g", 230, 8, 40, 4),
            food("Banana", 1, "piece", 105, 1, 27, 0),
            food("Whey protein", 30, "g", 120, 24, 3, 2),
        ],
        [
            food("Scrambled eggs", 3, "piece", 220, 18, 2, 15),
            food("Whole wheat toast", 2, "piece", 160, 8, 28, 2),
            food("Avocado", 50, "g", 80, 1, 4, 7),
        ],
        [
            food("Greek yogurt", 200, "g", 130, 20, 8, 2),
            food("Granola", 40, "g", 180, 4, 28, 6),
            food("Blueberries", 80, "g", 45, 1, 11, 0),
        ],
    ],
    lunch: [
        [
            food("Grilled chicken breast", 180, "g", 300, 56, 0, 7),
            food("White rice", 200, "g", 260, 5, 57, 1),
            food("Mixed vegetables", 100, "g", 50, 3, 9, 1),
        ],
        [
            food("Tuna sandwich", 1, "piece", 420, 30, 40, 14),
            food("Apple", 1, "piece", 95, 0, 25, 0),
        ],
        [
            food("Chicken biryani", 1, "serving", 650, 38, 80, 18),
            food("Cucumber raita", 100, "g", 60, 3, 5, 3),
        ],
    ],
    dinner: [
        [
            food("Salmon fillet", 170, "g", 350, 38, 0, 21),
            food("Roasted potatoes", 200, "g", 220, 4, 40, 6),
            food("Steamed broccoli", 100, "g", 35, 3, 7, 0),
        ],
        [
            food("Beef stir fry", 1, "serving", 480, 36, 32, 22),
            food("Egg noodles", 150, "g", 210, 7, 40, 3),
        ],
        [
            food("Lentil dal", 1, "serving", 320, 18, 48, 6),
            food("Chapati", 2, "piece", 240, 8, 44, 4),
            food("Chicken tikka", 120, "g", 200, 30, 3, 8),
        ],
    ],
    snack: [
        [food("Almonds", 30, "g", 175, 6, 6, 15), food("Apple", 1, "piece", 95, 0, 25, 0)],
        [food("Protein bar", 1, "piece", 210, 20, 22, 7)],
        [food("Whey shake", 1, "serving", 150, 25, 6, 3), food("Banana", 1, "piece", 105, 1, 27, 0)],
    ],
};

/** Slightly varies a template so days don't look identical. Piece counts stay whole. */
function scaleFood(item: FoodTemplate, scale: number, id: string): FoodItem {
    return {
        id,
        name: item.name,
        quantity: item.unit === "g" || item.unit === "ml" ? Math.round(item.quantity * scale) : item.quantity,
        unit: item.unit,
        calories: Math.round(item.calories * scale),
        macros: {
            protein: round1(item.macros.protein * scale),
            carbs: round1(item.macros.carbs * scale),
            fat: round1(item.macros.fat * scale),
        },
    };
}

/** Deterministic, so the same day always has the same meals and charts don't jump on refetch. */
function buildMealsForDay(offset: number): Meal[] {
    const rand = seeded(offset * 6151 + 29);
    const day = daysAgo(offset);
    const date = toISODate(day);

    // Roughly one day in ten has nothing logged (today is never skipped)
    if (offset > 0 && rand() < 0.1) return [];

    const meals: Meal[] = [];

    for (const mealType of MEAL_TYPES) {
        // Always draw the same numbers so skipping a meal doesn't shift later ones
        const roll = rand();
        const templates = MEAL_TEMPLATES[mealType];
        const template = templates[Math.floor(rand() * templates.length)];
        const scale = 0.9 + rand() * 0.25;

        if (roll >= LOG_CHANCE[mealType]) continue;

        const eatenAt = new Date(day);
        eatenAt.setHours(MEAL_HOUR[mealType], 0, 0, 0);
        // Today only has the meals that have already "happened"
        if (offset === 0 && eatenAt.getTime() > Date.now()) continue;

        const id = `meal-${date}-${mealType}`;
        const iso = eatenAt.toISOString();

        meals.push({
            id,
            date,
            mealType,
            items: template.map((item, i) => scaleFood(item, scale, `${id}-${i}`)),
            notes: "",
            createdAt: iso,
            updatedAt: iso,
        });
    }

    return meals;
}

/** Module scope, so create, edit and delete persist until a page refresh. */
let mockMeals: Meal[] = Array.from({ length: 90 }, (_, offset) => buildMealsForDay(offset)).flat();

const mealNotFound = () => ({
    isAxiosError: true,
    response: { status: 404, data: { message: "Meal not found." } },
});

/** Breakfast first, snacks last, and by creation time within the same type. */
const sortMeals = (meals: Meal[]): Meal[] =>
    [...meals].sort(
        (a, b) =>
            MEAL_TYPES.indexOf(a.mealType) - MEAL_TYPES.indexOf(b.mealType) ||
            a.createdAt.localeCompare(b.createdAt),
    );

const roundMacros = (m: Macros): Macros => ({
    protein: round1(m.protein),
    carbs: round1(m.carbs),
    fat: round1(m.fat),
});

/* ---- SERVICE ---- */

/** Everything the Nutrition page needs for one day (YYYY-MM-DD). */
export async function getNutritionDay(date: string): Promise<NutritionDay> {
    // --- REAL API ---
    // const { data } = await api.get<NutritionDay>(`/users/me/nutrition/days/${date}`);
    // return data;

    await wait(500);
    const meals = sortMeals(mockMeals.filter((m) => m.date === date));
    const totals = getMealsTotals(meals);

    return {
        date,
        meals,
        totals: { calories: Math.round(totals.calories), macros: roundMacros(totals.macros) },
        targets: MOCK_TARGETS,
    };
}

export async function getNutritionAnalytics(range: NutritionRange): Promise<NutritionAnalytics> {
    // --- REAL API ---
    // const { data } = await api.get<NutritionAnalytics>("/users/me/nutrition/analytics", {
    //     params: { range },
    // });
    // return data;

    await wait(700);

    const days = RANGE_DAYS[range];
    const byDate = new Map<string, Meal[]>();
    for (const meal of mockMeals) {
        byDate.set(meal.date, [...(byDate.get(meal.date) ?? []), meal]);
    }

    const trend: NutritionTrendPoint[] = [];
    let loggedDays = 0;
    let calorieSum = 0;
    let proteinSum = 0;
    let carbsSum = 0;
    let fatSum = 0;

    for (let i = 0; i < days; i++) {
        const date = toISODate(daysAgo(days - 1 - i));
        const meals = byDate.get(date) ?? [];
        const totals = getMealsTotals(meals);

        trend.push({
            date,
            calories: Math.round(totals.calories),
            macros: roundMacros(totals.macros),
        });

        if (meals.length > 0) {
            loggedDays += 1;
            calorieSum += totals.calories;
            proteinSum += totals.macros.protein;
            carbsSum += totals.macros.carbs;
            fatSum += totals.macros.fat;
        }
    }

    const divisor = loggedDays || 1;

    return {
        range,
        targets: MOCK_TARGETS,
        trend,
        averages: {
            calories: Math.round(calorieSum / divisor),
            macros: roundMacros({
                protein: proteinSum / divisor,
                carbs: carbsSum / divisor,
                fat: fatSum / divisor,
            }),
        },
        loggedDays,
    };
}

export async function createMeal(payload: CreateMealPayload): Promise<Meal> {
    // --- REAL API ---
    // const { data } = await api.post<Meal>("/users/me/meals", payload);
    // return data;

    await wait(500);
    const now = new Date().toISOString();
    const meal: Meal = { ...payload, id: newId(), createdAt: now, updatedAt: now };
    mockMeals = [...mockMeals, meal];
    return meal;
}

export async function updateMeal(id: string, payload: UpdateMealPayload): Promise<Meal> {
    // --- REAL API ---
    // const { data } = await api.patch<Meal>(`/users/me/meals/${id}`, payload);
    // return data;

    await wait(400);
    const current = mockMeals.find((m) => m.id === id);
    if (!current) throw mealNotFound();

    const updated: Meal = { ...current, ...payload, updatedAt: new Date().toISOString() };
    mockMeals = mockMeals.map((m) => (m.id === id ? updated : m));
    return updated;
}

export async function deleteMeal(id: string): Promise<void> {
    // --- REAL API ---
    // await api.delete(`/users/me/meals/${id}`);

    await wait(400);
    mockMeals = mockMeals.filter((m) => m.id !== id);
}



/* -------------------------------------------------------------------------- */
/*  PROGRESS                                                                   */
/* -------------------------------------------------------------------------- */

/* ---- MOCK DATA: delete this block when the API is ready ---- */

const PROGRESS_DAYS: Record<ProgressRange, number> = { "30d": 30, "90d": 90, "1y": 365 };
const MOCK_HISTORY_DAYS = 365;
const MOCK_GOAL_WEIGHT_KG = 75;

const progressError = (status: number, message: string) => ({
    isAxiosError: true,
    response: { status, data: { message } },
});

const atHour = (day: Date, hour: number) => {
    const d = new Date(day);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
};

/** Deterministic: the same day always gives the same check-in, so charts don't jump on refetch. */
function buildBodyEntry(offset: number): BodyEntry | null {
    const rand = seeded(offset * 3571 + 11);
    const roll = rand();

    // About one day in three has a check-in. Today always does.
    if (offset !== 0 && roll >= 0.35) return null;

    const noise = () => (rand() - 0.5) * 0.6;
    const withMeasurements = rand() < 0.3;
    const day = daysAgo(offset);
    const date = toISODate(day);
    const iso = atHour(day, 7);

    const measurements: Measurements = withMeasurements
        ? {
              chest: round1(100 - offset * 0.005 + noise()),
              waist: round1(82 + offset * 0.01 + noise()),
              hips: round1(98 + offset * 0.003 + noise()),
              biceps: round1(36 - offset * 0.003 + noise() * 0.5),
              thighs: round1(58 - offset * 0.002 + noise()),
          }
        : {};

    return {
        id: `body-${date}`,
        date,
        weightKg: round1(78.4 + offset * 0.012 + noise()),
        measurements,
        notes: "",
        createdAt: iso,
        updatedAt: iso,
    };
}

/** Where each record started a year ago, where it is now, and how much it wobbles. */
const PERFORMANCE_CURVES: Record<
    PerformanceMetricKey,
    { start: number; end: number; step: number; noise: number }
> = {
    bench_press: { start: 70, end: 85, step: 2.5, noise: 2.5 },
    squat: { start: 90, end: 112.5, step: 2.5, noise: 2.5 },
    deadlift: { start: 110, end: 140, step: 2.5, noise: 5 },
    run_5k: { start: 1680, end: 1440, step: 1, noise: 20 },
    pull_ups: { start: 5, end: 12, step: 1, noise: 1 },
};

function buildPerformanceEntry(
    metric: PerformanceMetricKey,
    index: number,
    offset: number,
): PerformanceEntry | null {
    // One record per metric every 14 days, staggered so they don't all land on the same day
    if ((offset + index * 3) % 14 !== 0) return null;

    const rand = seeded(offset * 911 + index * 37 + 5);
    const { start, end, step, noise } = PERFORMANCE_CURVES[metric];
    const progress = 1 - offset / (MOCK_HISTORY_DAYS - 1);
    const raw = start + (end - start) * progress + (rand() - 0.5) * 2 * noise;

    const day = daysAgo(offset);
    const date = toISODate(day);
    const iso = atHour(day, 18);

    return {
        id: `perf-${date}-${metric}`,
        date,
        metric,
        value: Math.round(raw / step) * step,
        notes: "",
        createdAt: iso,
        updatedAt: iso,
    };
}

/** Module scope, so create, edit and delete persist until a page refresh. */
let mockBodyEntries: BodyEntry[] = Array.from({ length: MOCK_HISTORY_DAYS }, (_, offset) =>
    buildBodyEntry(offset),
).filter((e): e is BodyEntry => e !== null);

let mockPerformance: PerformanceEntry[] = Array.from({ length: MOCK_HISTORY_DAYS }, (_, offset) =>
    PERFORMANCE_METRIC_KEYS.map((metric, index) => buildPerformanceEntry(metric, index, offset)),
)
    .flat()
    .filter((e): e is PerformanceEntry => e !== null);

/** Oldest first, which is what the charts expect. */
const sortOldestFirst = <T extends { date: string; createdAt: string }>(list: T[]): T[] =>
    [...list].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));

const DUPLICATE_DATE_MESSAGE = "You already logged a check-in for this date. Edit it instead.";

/* ---- SERVICE ---- */

/** Check-ins and records inside the range, oldest first. */
export async function getProgress(range: ProgressRange): Promise<ProgressData> {
    // --- REAL API ---
    // const { data } = await api.get<ProgressData>("/users/me/progress", {
    //     params: { range },
    // });
    // return data;

    await wait(600);
    const since = toISODate(daysAgo(PROGRESS_DAYS[range] - 1));

    return {
        range,
        body: sortOldestFirst(mockBodyEntries.filter((e) => e.date >= since)),
        performance: sortOldestFirst(mockPerformance.filter((e) => e.date >= since)),
        goalWeightKg: MOCK_GOAL_WEIGHT_KG,
    };
}

export async function createBodyEntry(payload: CreateBodyEntryPayload): Promise<BodyEntry> {
    // --- REAL API ---
    // const { data } = await api.post<BodyEntry>("/users/me/progress/body", payload);
    // return data;

    await wait(500);
    if (mockBodyEntries.some((e) => e.date === payload.date)) {
        throw progressError(409, DUPLICATE_DATE_MESSAGE);
    }

    const now = new Date().toISOString();
    const entry: BodyEntry = { ...payload, id: newId(), createdAt: now, updatedAt: now };
    mockBodyEntries = [...mockBodyEntries, entry];
    return entry;
}

export async function updateBodyEntry(
    id: string,
    payload: UpdateBodyEntryPayload,
): Promise<BodyEntry> {
    // --- REAL API ---
    // const { data } = await api.patch<BodyEntry>(`/users/me/progress/body/${id}`, payload);
    // return data;

    await wait(400);
    const current = mockBodyEntries.find((e) => e.id === id);
    if (!current) throw progressError(404, "Check-in not found.");

    if (payload.date && mockBodyEntries.some((e) => e.id !== id && e.date === payload.date)) {
        throw progressError(409, DUPLICATE_DATE_MESSAGE);
    }

    const updated: BodyEntry = { ...current, ...payload, updatedAt: new Date().toISOString() };
    mockBodyEntries = mockBodyEntries.map((e) => (e.id === id ? updated : e));
    return updated;
}

export async function deleteBodyEntry(id: string): Promise<void> {
    // --- REAL API ---
    // await api.delete(`/users/me/progress/body/${id}`);

    await wait(400);
    mockBodyEntries = mockBodyEntries.filter((e) => e.id !== id);
}

export async function createPerformance(payload: CreatePerformancePayload): Promise<PerformanceEntry> {
    // --- REAL API ---
    // const { data } = await api.post<PerformanceEntry>("/users/me/progress/performance", payload);
    // return data;

    await wait(500);
    const now = new Date().toISOString();
    const entry: PerformanceEntry = { ...payload, id: newId(), createdAt: now, updatedAt: now };
    mockPerformance = [...mockPerformance, entry];
    return entry;
}

export async function updatePerformance(
    id: string,
    payload: UpdatePerformancePayload,
): Promise<PerformanceEntry> {
    // --- REAL API ---
    // const { data } = await api.patch<PerformanceEntry>(`/users/me/progress/performance/${id}`, payload);
    // return data;

    await wait(400);
    const current = mockPerformance.find((e) => e.id === id);
    if (!current) throw progressError(404, "Record not found.");

    const updated: PerformanceEntry = { ...current, ...payload, updatedAt: new Date().toISOString() };
    mockPerformance = mockPerformance.map((e) => (e.id === id ? updated : e));
    return updated;
}

export async function deletePerformance(id: string): Promise<void> {
    // --- REAL API ---
    // await api.delete(`/users/me/progress/performance/${id}`);

    await wait(400);
    mockPerformance = mockPerformance.filter((e) => e.id !== id);
}