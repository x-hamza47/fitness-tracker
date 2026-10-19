
export function parseISODate(iso: string): Date {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export const formatDay = (iso: string) =>
    parseISODate(iso).toLocaleDateString("en", { month: "short", day: "numeric" });