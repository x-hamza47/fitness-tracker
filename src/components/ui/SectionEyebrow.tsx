import { motion } from "motion/react";
import ShinyText from "./ShinyText";

type SectionEyebrowProps = {
    index: string;
    text: string;
}

export default function SectionEyebrow({ index, text }: SectionEyebrowProps) {
    return (
        <motion.span
            className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-(--color-accent-dark)/40 bg-(--color-accent-dark)/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.25em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <span className="text-(--color-accent-dark)">{index ?? "01"}</span>
            <span className="h-3 w-px bg-white/20" />
            <ShinyText
                text={text}
                speed={4}
                color="#a1a1aa"
                shineColor="#f5f5f5"
                spread={120}
            />
        </motion.span>
    )
}
