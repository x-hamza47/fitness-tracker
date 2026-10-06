import { motion } from "motion/react";
import { FlipWords } from "@/components/ui/flip-words";
import HeroVisuals from "./HeroVisuals";
import MagicButton from "@/components/ui/MagicButton";
import SpecularButton from "@/components/ui/SpecularButton";
import { Spotlight } from "@/components/ui/Spotlight";
import ShinyText from "@/components/ui/ShinyText";

const words = ["STRENGTH", "DISCIPLINE", "PROGRESS", "PERFORMANCE"];

function Hero() {
    return (
        <section className="relative flex min-h-svh items-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24">
            {/* Grid background */}
            <div
                className="pointer-events-none absolute inset-0 z-0 bg-size-[48px_48px] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] md:bg-size-[88px_88px]"
            />
            <Spotlight
                className="z-1 -top-40 -left-20 md:-top-20 md:left-0"
                fill="#f59e0b"
            />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 sm:gap-12 lg:flex-row lg:justify-between lg:gap-8">

                {/* Left */}
                <motion.div
                    className="w-full lg:w-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-(--color-accent-dark)/40 bg-(--color-accent-dark)/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.25em]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="text-(--color-accent-dark)">01</span>
                        <span className="h-3 w-px bg-white/20" />
                        <ShinyText
                            text="Personal Performance System"
                            speed={4}
                            color="#a1a1aa"
                            shineColor="#f5f5f5"
                            spread={120}
                        />
                    </motion.span>

                    {/* Heading */}
                    <motion.h1
                        className="text-4xl font-semibold tracking-tight min-[400px]:text-5xl sm:text-6xl md:font-bold lg:text-6xl xl:text-7xl"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        BUILD YOUR <br />

                        <span className="inline-block min-w-[11ch]">
                            <FlipWords
                                words={words}
                                className="text-(--color-accent-dark)! p-0"
                            />
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="mt-5 max-w-lg text-sm leading-6 text-white/50 sm:mt-6 sm:text-base sm:leading-7"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Track workouts, nutrition and progress in one place.
                        Turn your training data into measurable performance.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-5"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <MagicButton
                            title="Start Training"
                            className="w-full text-sm sm:w-auto md:text-base"
                        />

                        <SpecularButton
                            size="lg"
                            radius={18}
                            tint="#ffffff"
                            tintOpacity={0.04}
                            shineFade={30}
                            textColor="#f5f5f5"
                            lineColor="#f59e0b"
                            baseColor="#181818"
                            intensity={1}
                            speed={0.35}
                            followMouse
                            proximity={150}
                            className="w-full text-sm! sm:w-auto md:text-base!"
                        >
                            Explore Features
                        </SpecularButton>
                    </motion.div>
                </motion.div>

                {/* Right */}
                <motion.div
                    className="w-full lg:w-1/2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <HeroVisuals />
                </motion.div>
            </div>

            {/* Scroll Cue */}
            <motion.div
                className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs tracking-[0.25em] text-white/30 sm:flex [@media(max-height:700px)]:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                <motion.div
                    className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1.5"
                    animate={{ y: [-16, 0] }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 5,
                        mass: 0.8,
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 1.2,
                    }}
                >
                    <motion.span
                        className="block h-1.5 w-1 rounded-full bg-(--color-accent-dark)"
                        animate={{ y: [0, 10] }}
                        transition={{
                            duration: 0.9,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                </motion.div>

                <span>SCROLL</span>
            </motion.div>
        </section>
    );
}

export default Hero;