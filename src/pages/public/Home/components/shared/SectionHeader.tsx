import type { ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
    index: string;
    label: string;
    title: ReactNode;
    description?: string;
};

export default function SectionHeader({ index, label, title, description }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-medium tracking-[0.25em] text-(--color-accent) uppercase">
                    {index}
                </span>
                <span className="h-px w-12 bg-white/20" />
                <span className="text-[10px] font-medium tracking-[0.25em] text-white/50 uppercase sm:text-xs">
                    {label}
                </span>
            </div>
            <h2 className="text-4xl leading-[0.98] font-bold tracking-tighter text-white uppercase sm:text-6xl">
                {title}
            </h2>
            {description && (
                <p className="mt-5 max-w-md text-sm leading-6 text-white/50 sm:text-base sm:leading-7">
                    {description}
                </p>
            )}
        </motion.div>
    );
}