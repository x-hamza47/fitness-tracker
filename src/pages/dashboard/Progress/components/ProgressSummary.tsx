import { convertLength, lengthUnit } from "@/features/progress/progress.config";
import { convertWeight, weightUnit } from "@/lib/units";
import { cn } from "@/lib/utils";
import type { UnitSystem } from "@/types/profile";
import { changeOverRange, latestValue, type ProgressData } from "@/types/progress";

type ProgressSummaryProps = {
    data: ProgressData;
    unitSystem: UnitSystem;
};

type Tone = "good" | "bad" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
    good: "text-emerald-300",
    bad: "text-red-300",
    neutral: "text-(--color-text-muted)",
};

const signed = (n: number, text: string) => `${n > 0 ? "+" : n < 0 ? "-" : ""}${text}`;

function Card({ label, value, hint, tone = "neutral" }: { label: string; value: string; hint?: string; tone?: Tone }) {
    return (
        <div className="rounded-sm border border-white/10 bg-white/[0.02] p-4">
            <dt className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{label}</dt>
            <dd className="mt-2 text-2xl font-semibold text-white tabular-nums">{value}</dd>
            {hint && <p className={cn("mt-1 text-xs tabular-nums", TONE_CLASS[tone])}>{hint}</p>}
        </div>
    );
}

export default function ProgressSummary({ data, unitSystem }: ProgressSummaryProps) {
    const wUnit = weightUnit(unitSystem);
    const lUnit = lengthUnit(unitSystem);

    const currentKg = latestValue(data.body, (e) => e.weightKg);
    const weightChange = changeOverRange(data.body, (e) => e.weightKg);
    const goalKg = data.goalWeightKg;

    // A change is "good" when it moves toward the goal weight
    let weightTone: Tone = "neutral";
    if (weightChange !== null && weightChange !== 0 && goalKg !== null && currentKg !== null) {
        const towardGoal = goalKg < currentKg ? weightChange < 0 : weightChange > 0;
        weightTone = towardGoal ? "good" : "bad";
    }

    const waistCm = latestValue(data.body, (e) => e.measurements.waist);
    const waistChange = changeOverRange(data.body, (e) => e.measurements.waist);
    const waistTone: Tone = waistChange === null || waistChange === 0 ? "neutral" : waistChange < 0 ? "good" : "bad";

    const remainingKg = currentKg !== null && goalKg !== null ? Math.abs(currentKg - goalKg) : null;

    return (
        <dl aria-label="Progress summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card
                label="Current weight"
                value={currentKg === null ? "-" : `${convertWeight(currentKg, unitSystem)} ${wUnit}`}
                hint={
                    weightChange === null
                        ? "Not enough data"
                        : `${signed(weightChange, `${convertWeight(Math.abs(weightChange), unitSystem)} ${wUnit}`)} in range`
                }
                tone={weightTone}
            />
            <Card
                label="To goal"
                value={
                    remainingKg === null
                        ? "-"
                        : remainingKg < 0.1
                          ? "Reached"
                          : `${convertWeight(remainingKg, unitSystem)} ${wUnit}`
                }
                hint={goalKg === null ? "No goal set" : `target ${convertWeight(goalKg, unitSystem)} ${wUnit}`}
            />
            <Card
                label="Waist"
                value={waistCm === null ? "-" : `${convertLength(waistCm, unitSystem)} ${lUnit}`}
                hint={
                    waistChange === null
                        ? "Not enough data"
                        : `${signed(waistChange, `${convertLength(Math.abs(waistChange), unitSystem)} ${lUnit}`)} in range`
                }
                tone={waistTone}
            />
            <Card
                label="Check-ins"
                value={String(data.body.length)}
                hint={`${data.performance.length} records`}
            />
        </dl>
    );
}