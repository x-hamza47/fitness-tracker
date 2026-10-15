import { useMemo, useState, type FormEvent } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { useInView } from "@/hooks/useInView";
import { GOALS, MACRO_COLORS, SEXES } from "./nutrition/config";
import { calculateTargets } from "./nutrition/calculateTargets";
import { labelClass } from "./nutrition/styles";
import type { Activity, Goal, Sex, Targets } from "./nutrition/types";
import NumberField from "./nutrition/NumberField";
import Segmented from "./nutrition/Segmented";
import ActivityTrack from "./nutrition/ActivityTrack";
import Macro from "./nutrition/Macro";
import BallFallback from "./nutrition/BallFallback";
import FuelBall from "./nutrition/FuelBall";


export default function NutritionTracking() {
    const [weight, setWeight] = useState("70");
    const [height, setHeight] = useState("175");
    const [age, setAge] = useState("25");
    const [sex, setSex] = useState<Sex>("male");
    const [goal, setGoal] = useState<Goal>("maintain");
    const [activity, setActivity] = useState<Activity>("moderate");
    const [error, setError] = useState<string | null>(null);


    const [targets, setTargets] = useState<Targets>(() =>
        calculateTargets({ weight: 70, height: 175, age: 25, sex: "male", goal: "maintain", activity: "moderate" })
    );

    const [ballRef, ballVisible] = useInView<HTMLDivElement>("200px", true);
    const reduce = useReducedMotion();
    const pulse = useAnimationControls();

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const w = Number(weight);
        const h = Number(height);
        const a = Number(age);

        if (!(w >= 30 && w <= 300)) return setError("Weight should be between 30 and 300 kg.");
        if (!(h >= 100 && h <= 250)) return setError("Height should be between 100 and 250 cm.");
        if (!(a >= 16 && a <= 100)) return setError("This calculator is for ages 16-100.");

        setError(null);
        setTargets(calculateTargets({ weight: w, height: h, age: a, sex, goal, activity }));
        if (!reduce) pulse.start({ scale: [1, 1.07, 1], transition: { duration: 0.7, ease: "easeOut" } });
    };

    const kcal = useAnimatedNumber(targets.kcal, 1100);

    const shares = useMemo(() => {
        const total = targets.kcal || 1;
        return {
            protein: (targets.protein * 4) / total,
            carbs: (targets.carbs * 4) / total,
            fats: (targets.fats * 9) / total,
        };
    }, [targets]);

    return (
        <section className="bg-(--color-bg) px-4 py-24 sm:px-6 sm:py-32" id="nutrition">
            <div className="mx-auto max-w-7xl">
                <SectionEyebrow index="05" text="Nutrition" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative"
                >
                    <h2 className="text-4xl leading-[0.98] font-semibold tracking-tighter text-(--color-text) uppercase [text-shadow:0_2px_16px_rgb(0_0_0/0.9)] min-[400px]:text-5xl sm:text-6xl xl:text-6xl">
                        Fuel the
                        <span className="text-(--color-accent-dark)"> work. </span>
                        <span className="text-(--color-text-muted)">Know your numbers.</span>
                    </h2>
                    <p className="mt-6 max-w-md text-sm leading-7 text-(--color-text-muted) sm:text-base">
                        Tell Forge about you and get daily calorie and macro targets in seconds. No account needed.
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
                    {/* Profile */}
                    <form
                        onSubmit={onSubmit}
                        noValidate
                        className="relative flex flex-col gap-7 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-[#0e0e11] to-[#060607] p-5 sm:p-8"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-(--color-accent-dark)/70 to-transparent"
                        />
                        <p className="text-[11px] tracking-[0.2em] text-(--color-accent-dark) uppercase">
                            01 / Your profile
                        </p>

                        <div className="grid grid-cols-3 gap-5">
                            <NumberField label="Weight" unit="kg" value={weight} onChange={setWeight} />
                            <NumberField label="Height" unit="cm" value={height} onChange={setHeight} />
                            <NumberField label="Age" unit="yrs" value={age} onChange={setAge} />
                        </div>

                        <Segmented label="Sex (used by the formula)" options={SEXES} value={sex} onChange={setSex} />
                        <Segmented label="Goal" options={GOALS} value={goal} onChange={setGoal} />
                        <ActivityTrack value={activity} onChange={setActivity} />

                        {error && (
                            <p role="alert" className="text-xs text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="group/btn mt-1 flex cursor-pointer items-center justify-between rounded-sm bg-(--color-accent-dark) px-5 py-3.5 text-sm font-bold tracking-wide text-black uppercase transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            Calculate my targets
                            <IconArrowUpRight
                                size={18}
                                aria-hidden="true"
                                className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                            />
                        </button>
                    </form>

                    {/* Results */}
                    <div className="relative min-h-140 overflow-hidden rounded-2xl border border-white/10 bg-[#030304]">
                        <div ref={ballRef} className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                            <motion.div animate={pulse} className="size-75 sm:size-105">
                                {ballVisible ? <FuelBall /> : <BallFallback />}
                            </motion.div>
                        </div>

                        <div className="pointer-events-none relative flex h-full min-h-140 flex-col justify-between p-5 sm:p-8">
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-[11px] tracking-[0.2em] text-(--color-accent-dark) uppercase">
                                    02 / Your daily target
                                </p>
                                <div className="text-right" aria-live="polite">
                                    <p className="text-5xl font-bold tracking-tighter text-white tabular-nums [text-shadow:0_2px_24px_rgb(0_0_0/0.9)] sm:text-6xl">
                                        {kcal.toLocaleString()}
                                    </p>
                                    <p className={`${labelClass} mt-1`}>est. kcal / day</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 sm:gap-6">
                                <Macro label="Protein" grams={targets.protein} share={shares.protein} color={MACRO_COLORS.protein} />
                                <Macro label="Carbs" grams={targets.carbs} share={shares.carbs} color={MACRO_COLORS.carbs} />
                                <Macro label="Fats" grams={targets.fats} share={shares.fats} color={MACRO_COLORS.fats} />
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-6 max-w-2xl text-xs leading-5 text-white/30">
                    Estimates use the Mifflin-St Jeor equation, an activity multiplier, and a modest goal adjustment
                    (-15% to lose fat, +10% to build). They are not medical advice. Speak to a qualified professional
                    before making major changes to your diet.
                </p>
            </div>
        </section>
    );
}