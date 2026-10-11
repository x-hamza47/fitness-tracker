export type PublicStats = {
    workoutsLogged: number;
    personalRecords: number;
    mealsTracked: number;
};

const MOCK_STATS: PublicStats = {
    workoutsLogged: 48250,
    personalRecords: 12840,
    mealsTracked: 96300,
};

export async function getPublicStats(): Promise<PublicStats> {
    // --- REAL API  ---
    // const { data } = await api.get<PublicStats>("/public/stats");
    // return data;

    await new Promise((r) => setTimeout(r,600));
    return MOCK_STATS;
}