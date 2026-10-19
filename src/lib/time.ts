const UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    { unit: "day", ms: 86_400_000 },
    { unit: "hour", ms: 3_600_000 },
    { unit: "minute", ms: 60_000 },
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "2026-10-19T08:00:00Z" -> "5 hours ago", or "in 3 hours" for future dates */
export function timeAgo(iso: string): string {
    const diff = new Date(iso).getTime() - Date.now();

    for (const { unit, ms } of UNITS) {
        if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
    }
    return "just now";
}