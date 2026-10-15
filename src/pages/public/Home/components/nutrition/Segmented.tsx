import { useId } from "react";
import { motion } from "motion/react";
import { labelClass } from "./styles";

type Props<T extends string> = {
    label: string;
    options: { id: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
};

export default function Segmented<T extends string>({ label, options, value, onChange }: Props<T>) {
    const group = useId();
    return (
        <div>
            <p className={labelClass}>{label}</p>
            <div
                role="radiogroup"
                aria-label={label}
                className="mt-2 grid rounded-sm border border-white/10 p-0.5"
                style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
            >
                {options.map((o) => {
                    const selected = o.id === value;
                    return (
                        <button
                            key={o.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onChange(o.id)}
                            className={`relative cursor-pointer rounded-[3px] px-2 py-2 text-xs font-semibold tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-(--color-accent-dark) focus-visible:outline-none ${
                                selected ? "text-black" : "text-white/50 hover:text-white"
                            }`}
                        >
                            {selected && (
                                <motion.span
                                    layoutId={group}
                                    className="absolute inset-0 rounded-[3px] bg-(--color-accent-dark)"
                                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                />
                            )}
                            <span className="relative">{o.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}