import type { UnitSystem } from "@/types/profile";

const KG_TO_LB = 2.20462;

export function convertWeight(kg: number, system: UnitSystem): number {
    const value = system === "imperial" ? kg * KG_TO_LB : kg;
    return Math.round(value * 10) / 10;
}

export const weightUnit = (system: UnitSystem) => (system === "imperial" ? "lb" : "kg");
/** Typed weight (in the user's unit) -> kg for storage */
export function convertWeightToKg(value: number, system: UnitSystem): number {
    const kg = system === "imperial" ? value / KG_TO_LB : value;
    return Math.round(kg * 100) / 100;
}