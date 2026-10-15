import { useId } from "react";
import { labelClass } from "./styles";

type Props = {
    label: string;
    unit: string;
    value: string;
    onChange: (v: string) => void;
};

export default function NumberField({ label, unit, value, onChange }: Props) {
    const id = useId();
    return (
        <label
            htmlFor={id}
            className="block cursor-text rounded-lg border border-white/10 bg-white/3 px-3 pt-2.5 pb-2 transition-colors focus-within:border-(--color-accent-dark)/70 focus-within:bg-(--color-accent-dark)/5 hover:border-white/20"
        >
            <span className={labelClass}>{label}</span>
            <span className="mt-1 flex items-baseline gap-1">
                <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full min-w-0 [appearance:textfield] bg-transparent text-2xl font-semibold tracking-tighter text-white tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-xs text-white/35">{unit}</span>
            </span>
        </label>
    );
}