import { useEffect, useRef, useState } from "react";
import {
    animate,
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from "motion/react";
import { IconBarbell, IconTrophy, IconSalad } from "@tabler/icons-react";
import { usePublicStats } from "@/hooks/usePublicStats";


/* ---------- Scroll-lit statement ---------- */

const STATEMENT: { text: string; accent?: boolean }[] = [
    { text: "Every" }, { text: "rep." },
    { text: "Every" }, { text: "meal." },
    { text: "Every" }, { text: "session." },
    { text: "Logged," }, { text: "measured," },
    { text: "and" }, { text: "forged", accent: true },
    { text: "into" }, { text: "progress", accent: true },
    { text: "you" }, { text: "can" }, { text: "see." },
];

function Word({
    text,
    accent,
    progress,
    range,
    reduceMotion,
}: {
    text: string;
    accent?: boolean;
    progress: MotionValue<number>;
    range: [number, number];
    reduceMotion: boolean;
}) {
    const opacity = useTransform(progress, range, [0.18, 1]);
    return (
        <span className="mr-[0.22em] inline-block">
            <motion.span
                style={{ opacity: reduceMotion ? 1 : opacity }}
                className={accent ? "text-(--color-accent)" : "text-white"}
            >
                {text}
            </motion.span>
        </span>
    );
}

function Statement() {
    const ref = useRef<HTMLParagraphElement>(null);
    const reduceMotion = useReducedMotion() ?? false;
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.85", "end 0.5"],
    });

    return (
        <p
            ref={ref}
            className="max-w-6xl text-left text-[2.6rem] leading-[0.98] font-bold tracking-tighter uppercase min-[400px]:text-5xl sm:text-7xl lg:text-8xl"
        >
            {STATEMENT.map((w, i) => {
                const start = i / STATEMENT.length;
                const end = start + 1 / STATEMENT.length;
                return (
                    <Word
                        key={i}
                        text={w.text}
                        accent={w.accent}
                        progress={scrollYProgress}
                        range={[start, end]}
                        reduceMotion={reduceMotion}
                    />
                );
            })}
        </p>
    );
}

/* ---------- Count up ---------- */


function CountUp({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const reduceMotion = useReducedMotion() ?? false;
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView || reduceMotion) return;

        const controls = animate(0, value, {
            duration: 1.8,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
        });

        return () => controls.stop();
    }, [inView, value, reduceMotion]);

    const shown = reduceMotion ? value : display;

    return (
        <span ref={ref}>
            <span className="sr-only">{value.toLocaleString()}</span>
            <span aria-hidden="true">{shown.toLocaleString()}</span>
        </span>
    );
}

/* ---------- Stats row ---------- */

function Stat({
    icon,
    label,
    value,
    loading,
    delay,
}: {
    icon: React.ReactNode;
    label: string;
    value?: number;
    loading: boolean;
    delay: number;
}) {
    return (
        <motion.div
            className="py-8 first:pt-0 last:pb-0 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.25em] text-white/50 uppercase">
                <span className="text-(--color-accent)">{icon}</span>
                {label}
            </div>
            <div className="mt-4 text-6xl font-bold tracking-tighter text-white tabular-nums sm:text-6xl lg:text-7xl">
                {loading || value === undefined ? (
                    <div
                        className="h-14 w-40 animate-pulse rounded-sm bg-white/10 lg:h-18"
                        aria-hidden="true"
                    />
                ) : (
                    <CountUp value={value} />
                )}
            </div>
        </motion.div>
    );
}

/* ---------- Section ---------- */

function Manifesto() {
    const { data, isLoading } = usePublicStats();

    return (
        <section className="relative overflow-hidden bg-(--color-bg) px-4 py-28 sm:px-6 sm:py-40">
            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Section marker */}
                <motion.div
                    className="mb-10 flex items-center gap-4 sm:mb-14"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-xs font-medium tracking-[0.25em] text-(--color-accent) uppercase">
                        02
                    </span>
                    <span className="h-px w-12 bg-white/20 sm:w-20" />
                    <span className="text-[10px] font-medium tracking-[0.25em] text-white/50 uppercase sm:text-xs">
                        The Philosophy
                    </span>
                </motion.div>

                <Statement />

                {/* Stats: offset to the right on desktop for an asymmetric layout */}
                <div className="mt-20 sm:mt-28 lg:ml-auto lg:w-10/12">
                    <div className="grid divide-y divide-white/10 border-t border-white/20 pt-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:pt-10">
                        <Stat
                            icon={<IconBarbell size={16} stroke={1.75} />}
                            label="Workouts logged"
                            value={data?.workoutsLogged}
                            loading={isLoading}
                            delay={0}
                        />
                        <Stat
                            icon={<IconTrophy size={16} stroke={1.75} />}
                            label="Personal records"
                            value={data?.personalRecords}
                            loading={isLoading}
                            delay={0.1}
                        />
                        <Stat
                            icon={<IconSalad size={16} stroke={1.75} />}
                            label="Meals tracked"
                            value={data?.mealsTracked}
                            loading={isLoading}
                            delay={0.2}
                        />
                    </div>

              
                </div>
            </div>
        </section>
    );
}

export default Manifesto;