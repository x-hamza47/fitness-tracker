import { motion } from "motion/react";

export default function HeroVisuals() {
    return (
        <div className="relative flex w-full max-w-xl items-center justify-center lg:w-[48%]">
            <div className="relative aspect-square w-full max-w-130 overflow-hidden rounded-[2.5rem]">

                {/* Soft light behind the object */}
                <div className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-accent)/10 blur-3xl" />

                {/* Floor */}
                <div className="absolute bottom-[16%] left-1/2 h-px w-[70%] -translate-x-1/2 bg-white/10" />

                <div className="absolute bottom-[16%] left-1/2 h-32 w-[65%] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(255,255,255,0.08),transparent_70%)] blur-xl" />

                {/* Floating dumbbell */}
                <motion.div
                    className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        y: [-8, 8, -8],
                        rotate: [-2, 2, -2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {/* Left weight */}
                    <div className="absolute right-27 top-1/2 h-24 w-12 -translate-y-1/2 rounded-xl border border-white/15 bg-[#202020] shadow-2xl">
                        <div className="absolute left-1/2 top-1/2 h-14 w-1 -translate-x-1/2 -translate-y-1/2 bg-white/10" />
                    </div>

                    {/* Left inner plate */}
                    <div className="absolute right-20.5 top-1/2 h-16 w-8 -translate-y-1/2 rounded-lg bg-[#181818]" />

                    {/* Handle */}
                    <div className="h-5 w-52 rounded-full border border-white/10 bg-[#292929] shadow-lg">
                        <div className="absolute left-1/2 top-1/2 h-3 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111]" />
                    </div>

                    {/* Right inner plate */}
                    <div className="absolute left-20.5 top-1/2 h-16 w-8 -translate-y-1/2 rounded-lg bg-[#181818]" />

                    {/* Right weight */}
                    <div className="absolute left-27 top-1/2 h-24 w-12 -translate-y-1/2 rounded-xl border border-white/15 bg-[#202020] shadow-2xl">
                        <div className="absolute left-1/2 top-1/2 h-14 w-1 -translate-x-1/2 -translate-y-1/2 bg-white/10" />
                    </div>

                    {/* Small amber detail */}
                    <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--color-accent)/60 bg-(--color-accent)/20" />
                </motion.div>

                {/* Floating block - left */}
                <motion.div
                    className="absolute bottom-[27%] left-[17%] h-14 w-14 rotate-12 rounded-xl border border-white/10 bg-[#1b1b1b] shadow-xl"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Floating block - right */}
                <motion.div
                    className="absolute bottom-[25%] right-[18%] h-20 w-20 -rotate-6 rounded-2xl border border-white/10 bg-[#181818] shadow-xl"
                    animate={{ y: [4, -4, 4] }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Small amber accent */}
                <motion.div
                    className="absolute right-[24%] top-[24%] h-2 w-2 rounded-full bg-(--color-accent)"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                />

                {/* Subtle vignette */}
                <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
            </div>
        </div>
    );
}