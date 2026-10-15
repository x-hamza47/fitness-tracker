import { ACTIVITIES } from "./config";
import { labelClass } from "./styles";
import type { Activity } from "./types";

type Props = {
    value: Activity;
    onChange: (v: Activity) => void;
};

export default function ActivityTrack({ value, onChange }: Props) {
    const index = ACTIVITIES.findIndex((a) => a.id === value);
    const current = ACTIVITIES[index];

    return (
        <div>
            <p className={labelClass}>Activity level</p>
            <div role="radiogroup" aria-label="Activity level" className="mt-3 grid grid-cols-4 gap-2">
                {ACTIVITIES.map((a, i) => {
                    const filled = i <= index;
                    const selected = a.id === value;
                    return (
                        <button
                            key={a.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onChange(a.id)}
                            className="group/step cursor-pointer text-left focus-visible:outline-none"
                        >
                            <span
                                className="block h-2 rounded-full transition-all duration-300 group-focus-visible/step:ring-2 group-focus-visible/step:ring-white/70"
                                style={{
                                    backgroundColor: filled ? a.color : "rgba(255,255,255,0.1)",
                                    boxShadow: selected ? `0 0 14px ${a.color}` : "none",
                                }}
                            />
                            <span
                                className="mt-2 block text-[11px] leading-tight font-medium transition-colors"
                                style={{ color: selected ? a.color : "rgba(255,255,255,0.4)" }}
                            >
                                {a.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="mt-3 flex items-center gap-2 text-xs text-white/50" aria-live="polite">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: current.color }} aria-hidden="true" />
                {current.hint}
            </p>
        </div>
    );
}