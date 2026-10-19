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