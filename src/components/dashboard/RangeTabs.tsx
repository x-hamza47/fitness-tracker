import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type RangeTabOption<T extends string> = {
    value: T;
    label: string;
};

type RangeTabsProps<T extends string> = {
    options: readonly RangeTabOption<T>[];
    value: T;
    onChange: (value: T) => void;
    
    label: string;
    className?: string;
};

export default function RangeTabs<T extends string>({
    options,
    value,
    onChange,
    label,
    className,
}: RangeTabsProps<T>) {
    
    const highlightId = useId();
    return (
        <div
            role="radiogroup"
            aria-label={label}
            className={cn(
                "inline-flex rounded-sm border border-white/10 bg-white/2 p-0.5",
                className,
            )}
        >
            {options.map((option) => {
                const isActive = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "relative cursor-pointer rounded-sm px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                            isActive ? "text-white" : "text-white/50 hover:text-white",
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={highlightId}
                                className="absolute inset-0 rounded-sm bg-white/10"
                                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            />
                        )}
                        <span className="relative">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}