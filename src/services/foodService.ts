import { api } from "@/lib/api";

export type FoodResult = {
    fdcId: number;
    name: string;
    calories: number; 
    protein: number; 
    carbs: number; 
    fat: number; 
};

export async function searchFoods(q: string): Promise<FoodResult[]> {
    const { data } = await api.get("/foods/search", { params: { q } });
    return data.data;
}