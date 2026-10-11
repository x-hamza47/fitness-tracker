import { motion } from "motion/react";
import MagicButton from "@/components/ui/MagicButton";

export default function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-(--color-bg) px-4 py-32 sm:px-6 sm:py-44">
            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <span className="text-xs font-medium tracking-[0.25em] text-(--color-accent) uppercase">
                        07
                    </span>
                    <h2 className="mt-6 max-w-4xl text-5xl leading-[0.95] font-bold tracking-tighter text-white uppercase sm:text-7xl lg:text-8xl">
                        Start <span className="text-(--color-accent)">forging</span> today
                    </h2>
                    <div className="mt-10">
                        <MagicButton title="Get Started" className="w-full sm:w-auto" />
                    </div>
                </motion.div>

                {/* Slot: reuse hero grid + Spotlight here, or add an image of your 3D objects */}
            </div>
        </section>
    );
}