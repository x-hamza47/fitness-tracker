import { ACTIVITIES, FAT_SHARE, GOAL_ADJUST, PROTEIN_PER_KG } from "./config";
import type { Inputs, Targets } from "./types";

export function calculateTargets({ weight, height, age, sex, goal, activity }: Inputs): Targets {
    const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === "male" ? 5 : -161);
    const factor = ACTIVITIES.find((a) => a.id === activity)!.factor;
    const floor = sex === "male" ? 1500 : 1200;
    const kcal = Math.max(Math.round((bmr * factor * GOAL_ADJUST[goal]) / 10) * 10, floor);

    const protein = Math.round(weight * PROTEIN_PER_KG[goal]);
    const fats = Math.round((kcal * FAT_SHARE) / 9);
    const carbs = Math.max(Math.round((kcal - protein * 4 - fats * 9) / 4), 0);

    return { kcal, protein, carbs, fats };
}