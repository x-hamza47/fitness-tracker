export type Sex = "male" | "female";
export type Goal = "lose" | "maintain" | "build";
export type Activity = "sedentary" | "light" | "moderate" | "very";

export interface Inputs {
    weight: number;
    height: number;
    age: number;
    sex: Sex;
    goal: Goal;
    activity: Activity;
}

export interface Targets {
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
}