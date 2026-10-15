import { motion } from "motion/react";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { labelClass } from "./styles";

type Props = {
    label: string;
    grams: number;
    share: number; 
    color: string;
};

export default function Macro({ label, grams, share, color }: Props) {
    const animated = useAnimatedNumber(grams);
    const pct = Math.round(share * 100);

    return (
        <div className="rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md sm:p-4">
            <div className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                <p className={labelClass}>{label}</p>
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tighter text-white tabular-nums sm:text-3xl">
                {animated}
                <span className="ml-1 text-xs font-normal text-white/40">g</span>
            </p>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>

            <p className="mt-2 text-[10px] tracking-wider text-white/40 uppercase">{pct}% of kcal</p>
        </div>
    );
}