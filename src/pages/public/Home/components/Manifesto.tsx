import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
    IconBarbell,
    IconTrophy,
    IconSalad,
    IconToolsKitchen2,
    IconTrendingUp,
} from "@tabler/icons-react";
import { usePublicStats } from "@/hooks/usePublicStats";
import LaserFlow from "@/components/ui/LaserFlow";
import dashboardPreview from "@/assets/dashboard-preview.jpeg";
import dashboardReveal from "@/assets/dashboard-reveal.jpeg";
import ShinyText from "@/components/ui/ShinyText";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import CountUp from "@/components/ui/CountUp";


const FEATURES = [
    {
        icon: <IconBarbell size={32} stroke={1.5} />,
        title: "Track every rep",
        text: "Log workouts with precision and watch your strength climb over time.",
    },
    {
        icon: <IconToolsKitchen2 size={32} stroke={1.5} />,
        title: "Fuel your goals",
        text: "Track nutrition effortlessly and stay aligned with your plan.",
    },
    {
        icon: <IconTrendingUp size={32} stroke={1.5} />,
        title: "Measure progress",
        text: "Powerful insights help you adjust, improve, and keep moving forward.",
    },
];

function Intro() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
        >
            {/* Headline */}
            <h2 className="text-4xl leading-[0.98] font-semibold tracking-tighter text-(--color-text) uppercase [text-shadow:0_2px_16px_rgb(0_0_0/0.9)] min-[400px]:text-5xl sm:text-6xl xl:text-6xl">
                Everything
                <span className="text-(--color-text-muted)"> you need. </span>
                Nothing <span className="text-(--color-accent-dark)">wasted.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-(--color-text-muted) sm:text-base">
                Every rep. Every meal. Every session. Turn the work you put in
                into progress you can actually measure.
            </p>
            <div className="h-px w-full bg-linear-to-r mt-2 from-(--color-accent-dark) via-(--color-accent-dark)/30 to-transparent" />


            <ul className="space-y-2 mt-2 sm:mt-0">
                {FEATURES.map((feature, index) => (
                    <motion.li
                        key={feature.title}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
                        className="flex items-center gap-4 sm:p-4"
                    >
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-(--color-surface-light) bg-(--color-surface) text-(--color-accent-dark)">
                            {feature.icon}
                        </span>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold tracking-wide text-(--color-text)">
                                {feature.title}
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-(--color-text-muted) sm:text-sm">
                                {feature.text}
                            </p>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
}

function DashboardCard({ cardRef }: { cardRef: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div
            ref={cardRef}
            className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d]"
        >
            <img
                src={dashboardPreview}
                alt="FORGE dashboard showing training volume, weekly goal and workouts"
                className="block w-full"
                loading="lazy"
            />
        </div>
    );
}

function StatCard({
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
            className="h-full w-full min-w-0"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            <CardContainer
                containerClassName="h-full w-full py-0 items-stretch"
                className="h-full w-full items-stretch"
            >
                <CardBody className="relative flex h-full w-full flex-col rounded-xl border border-white/10 p-3 sm:p-4 lg:p-3 xl:p-4">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-xl bg-white/4 backdrop-blur-md"
                    />

                    <CardItem
                        translateZ="40"
                        className="flex size-7 items-center justify-center rounded-lg bg-(--color-accent-dark)/15 text-(--color-accent-dark) sm:size-8"
                    >
                        {icon}
                    </CardItem>

                    <CardItem
                        as="div"
                        translateZ="60"
                        className="mt-3 flex h-8 items-center text-xl font-bold tracking-tighter text-white tabular-nums sm:mt-4 sm:h-10 sm:text-3xl lg:text-2xl xl:text-3xl"
                    >
                        {loading || value === undefined ? (
                            <div
                                className="h-6 w-12 animate-pulse rounded-sm bg-white/10 sm:h-9 sm:w-24"
                                aria-hidden="true"
                            />
                        ) : (
                            <CountUp
                                from={0}
                                to={value}
                                mode="roll"
                                easing="spring"
                                format="compact"
                                separator=","
                                direction="up"
                                duration={2.4}
                                delay={delay}
                                trigger="view"
                                replayOnHover
                            />
                        )}
                    </CardItem>

                    <CardItem
                        translateZ="30"
                        className="mt-auto pt-2 text-[8px] leading-tight font-medium tracking-[0.12em] text-white/50 uppercase sm:text-[10px] sm:tracking-[0.2em]"
                    >
                        {label}
                    </CardItem>
                </CardBody>
            </CardContainer>
        </motion.div>
    );
}

function StatCards({
    data,
    loading,
}: {
    data?: { workoutsLogged?: number; personalRecords?: number; mealsTracked?: number };
    loading: boolean;
}) {
    return (
        <div className="grid w-full grid-cols-3 items-stretch gap-2 sm:gap-3">
            <StatCard
                icon={<IconBarbell size={18} stroke={1.75} />}
                label="Workouts logged"
                value={data?.workoutsLogged}
                loading={loading}
                delay={0}
            />
            <StatCard
                icon={<IconTrophy size={18} stroke={1.75} />}
                label="Personal records"
                value={data?.personalRecords}
                loading={loading}
                delay={0.1}
            />
            <StatCard
                icon={<IconSalad size={18} stroke={1.75} />}
                label="Meals tracked"
                value={data?.mealsTracked}
                loading={loading}
                delay={0.2}
            />
        </div>
    );
}



function Manifesto() {
    const { data, isLoading } = usePublicStats();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
    );

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const onChange = () => setIsDesktop(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return (
        <section className="relative overflow-hidden bg-(--color-bg) px-4 pb-24 sm:px-6 sm:pb-32" id="features">
            <div className="absolute inset-0 z-0">
                <LaserFlow
                    surfaceRef={cardRef}
                    beamPosition={isDesktop ? 0.75 : 0.7}
                    color="#ff6a00"
                    intensity={1.2}
                    beamWidth={0.8}
                    flare={1.2}
                    spread={0.9}
                    spill={0.4}
                    fog={isDesktop ? 1 : 0.5}
                    dust={isDesktop ? 1.6 : 0.6}
                    streaks={1.5}
                    dots={1}
                    pulse={1.5}
                    speed={1}
                    seed={3}
                    dpr={isDesktop ? undefined : 1}
                    mouseInteraction={isDesktop}
                    revealImage={dashboardReveal}
                    revealRadius={220}
                    revealOpacity={0.9}
                    intro
                />
            </div>


            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 " />

            <div className="relative z-10 mx-auto max-w-7xl pt-20 sm:pt-24">

                <motion.span
                    className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-(--color-accent-dark)/40 bg-(--color-accent-dark)/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.25em]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <span className="text-(--color-accent-dark)">02</span>
                    <span className="h-3 w-px bg-white/20" />
                    <ShinyText
                        text="The Philosophy"
                        speed={4}
                        color="#a1a1aa"
                        shineColor="#f5f5f5"
                        spread={120}
                    />
                </motion.span>

                <div className="grid items-start gap-10 pt-8 sm:gap-12 sm:pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <Intro />
                        <StatCards data={data} loading={isLoading} />
                    </div>

                    <div className="lg:pt-72">
                        <DashboardCard cardRef={cardRef} />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Manifesto;