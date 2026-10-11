import SectionHeader from "@/pages/public/Home/components/shared/SectionHeader";
import Slot from "@/pages/public/Home/components/shared/Slot";

const METRICS = ["Body weight", "Lifts", "Consistency", "Measurements"];

export default function ProgressAnalytics() {
    return (
        <section className="bg-(--color-bg) px-4 py-24 sm:px-6 sm:py-32" id="progress">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    index="04"
                    label="Progress"
                    title={
                        <>
                            See it <span className="text-(--color-accent)">move</span>
                        </>
                    }
                    description="Weight, lifts, measurements and consistency, charted over time."
                />

                <div className="mt-8 flex flex-wrap gap-2">
                    {METRICS.map((m, i) => (
                        <span
                            key={m}
                            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide ${
                                i === 0
                                    ? "border-(--color-accent)/60 text-(--color-accent)"
                                    : "border-white/15 text-white/50"
                            }`}
                        >
                            {m}
                        </span>
                    ))}
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-3">
                    <Slot
                        label="Main chart"
                        hint="Search: chart, line graph. Changes with the chips above."
                        className="h-80 lg:col-span-2 lg:h-96"
                    />
                    <div className="grid gap-4">
                        <Slot label="Stat: current weight" hint="Search: count up" className="h-28" />
                        <Slot label="Stat: bench PR" hint="Search: count up" className="h-28" />
                        <Slot label="Stat: weekly workouts" hint="Search: progress bar" className="h-28" />
                    </div>
                </div>
            </div>
        </section>
    );
}