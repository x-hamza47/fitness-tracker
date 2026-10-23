import { api } from "@/lib/api";
import type { DateRange, OverviewData } from "@/types/dashboard";
import type {
    CreateWorkoutPayload,
    UpdateWorkoutPayload,
    Workout,
} from "@/types/workout";
import type {
    CreateMealPayload,
    Meal,
    NutritionAnalytics,
    NutritionDay,
    NutritionRange,
    UpdateMealPayload,
} from "@/types/nutrition";
import type {
    BodyEntry,
    CreateBodyEntryPayload,
    CreatePerformancePayload,
    PerformanceEntry,
    ProgressData,
    ProgressRange,
    UpdateBodyEntryPayload,
    UpdatePerformancePayload,
} from "@/types/progress";

export async function getOverview(range: DateRange): Promise<OverviewData> {
    const { data } = await api.get("/overview", { params: { range } });
    return data.data;
}

// -------------------------------------------------------------------------- 
// WORKOUTS                                                                  
// --------------------------------------------------------------------------

// const newId = () =>
//     typeof crypto !== "undefined" && "randomUUID" in crypto
//         ? crypto.randomUUID()
//         : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function getWorkouts(): Promise<Workout[]> {
    const { data } = await api.get("/workouts");
    return data.data;
}

export async function createWorkout(payload: CreateWorkoutPayload): Promise<Workout> {
    const { data } = await api.post("/workouts", payload);
    return data.data;
}

export async function updateWorkout(
    id: string,
    payload: UpdateWorkoutPayload,
): Promise<Workout> {
    const { data } = await api.patch(`/workouts/${id}`, payload);
    return data.data;
}

export async function duplicateWorkout(id: string): Promise<Workout> {
    const { data } = await api.post(`/workouts/${id}/duplicate`);
    return data.data;
}

export async function deleteWorkout(id: string): Promise<void> {
    await api.delete(`/workouts/${id}`);
}

/* -------------------------------------------------------------------------- */
/*  NUTRITION                                                                  */
/* -------------------------------------------------------------------------- */
export async function getNutritionDay(date: string): Promise<NutritionDay> {
    const { data } = await api.get(`/nutrition/days/${date}`);
    return data.data;
}

export async function getNutritionAnalytics(range: NutritionRange): Promise<NutritionAnalytics> {
    const { data } = await api.get("/nutrition/analytics", { params: { range } });
    return data.data;
}

export async function createMeal(payload: CreateMealPayload): Promise<Meal> {
    const { data } = await api.post("/nutrition/meals", payload);
    return data.data;
}

export async function updateMeal(id: string, payload: UpdateMealPayload): Promise<Meal> {
    const { data } = await api.patch(`/nutrition/meals/${id}`, payload);
    return data.data;
}

export async function deleteMeal(id: string): Promise<void> {
    await api.delete(`/nutrition/meals/${id}`);
}


//-------------------------------------------------------------------------- 
//  PROGRESS                                                                  
//-------------------------------------------------------------------------- 

export async function getProgress(range: ProgressRange): Promise<ProgressData> {
    const { data } = await api.get("/progress", { params: { range } });
    return data.data;
}

export async function createBodyEntry(payload: CreateBodyEntryPayload): Promise<BodyEntry> {
    const { data } = await api.post("/progress/body", payload);
    return data.data;
}

export async function updateBodyEntry(
    id: string,
    payload: UpdateBodyEntryPayload,
): Promise<BodyEntry> {
    const { data } = await api.patch(`/progress/body/${id}`, payload);
    return data.data;
}

export async function deleteBodyEntry(id: string): Promise<void> {
    await api.delete(`/progress/body/${id}`);
}

export async function createPerformance(payload: CreatePerformancePayload): Promise<PerformanceEntry> {
    const { data } = await api.post("/progress/performance", payload);
    return data.data;
}

export async function updatePerformance(
    id: string,
    payload: UpdatePerformancePayload,
): Promise<PerformanceEntry> {
    const { data } = await api.patch(`/progress/performance/${id}`, payload);
    return data.data;
}

export async function deletePerformance(id: string): Promise<void> {
    await api.delete(`/progress/performance/${id}`);
}