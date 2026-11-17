import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { formatDayDate, formatDayLabel, shiftDate, todayISO } from "@/features/nutrition/nutrition.config";
import { cn } from "@/lib/utils";

type DaySwitcherProps = {
    date: string;
    onChange: (date: string) => void;
};

const ARROW =
    "cursor-pointer rounded-sm border border-white/10 p-2 text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/60";

export default function DaySwitcher({ date, onChange }: DaySwitcherProps) {
    const today = todayISO();
    const isToday = date === today;

    return (
        <div className="flex items-center flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onChange(shiftDate(date, -1))}
                aria-label="Previous day"
                className={ARROW}
            >
                <IconChevronLeft size={16} stroke={1.5} aria-hidden="true" />
            </button>

            <div className="min-w-36 text-center" aria-live="polite">
                <p className="text-sm font-semibold text-white">{formatDayLabel(date)}</p>
                <p className="text-[10px] tracking-[0.15em] text-white/40 uppercase">{formatDayDate(date)}</p>
            </div>

            <button
                type="button"
                onClick={() => onChange(shiftDate(date, 1))}
                disabled={isToday}
                aria-label="Next day"
                className={ARROW}
            >
                <IconChevronRight size={16} stroke={1.5} aria-hidden="true" />
            </button>

            <label className="sr-only" htmlFor="nutrition-date">
                Pick a date
            </label>
            <input
                id="nutrition-date"
                type="date"
                value={date}
                max={today}
                onChange={(e) => e.target.value && onChange(e.target.value)}
                className="rounded-sm border border-white/10 bg-white/2 px-2 py-2 text-xs text-white scheme-dark focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            />

            {!isToday && (
                <button
                    type="button"
                    onClick={() => onChange(today)}
                    className={cn(
                        "cursor-pointer text-[10px] tracking-[0.15em] text-white/50 uppercase underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                    )}
                >
                    Today
                </button>
            )}
        </div>
    );
}