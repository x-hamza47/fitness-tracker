import type { Workout, WorkoutCategory, WorkoutFilters } from "@/types/workout";

export function applyWorkoutFilters(workouts: Workout[], filters: WorkoutFilters): Workout[] {
    const query = filters.search.trim().toLowerCase();

    const matches = workouts.filter((w) => {
        if (filters.category !== "all" && w.category !== filters.category) return false;
        if (filters.tag && !w.tags.includes(filters.tag)) return false;
        if (!query) return true;

        return (
            w.name.toLowerCase().includes(query) ||
            w.tags.some((t) => t.includes(query)) ||
            w.exercises.some((e) => e.name.toLowerCase().includes(query))
        );
    });

    return matches.sort((a, b) => {
        // Favorites are always pinned on top
        const pinned = Number(b.favorite) - Number(a.favorite);
        if (pinned !== 0) return pinned;

        switch (filters.sort) {
            case "name":
                return a.name.localeCompare(b.name);
            case "exercises":
                return b.exercises.length - a.exercises.length;
            default:
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
    });
}

export function getAllTags(workouts: Workout[]): string[] {
    return [...new Set(workouts.flatMap((w) => w.tags))].sort();
}

export function getCategoryCounts(workouts: Workout[]): Record<WorkoutCategory | "all", number> {
    const counts: Record<WorkoutCategory | "all", number> = {
        all: workouts.length,
        strength: 0,
        cardio: 0,
        flexibility: 0,
        hiit: 0,
    };
    workouts.forEach((w) => counts[w.category]++);
    return counts;
}