import SectionHeader from "./shared/SectionHeader";
import Slot from "./shared/Slot";

const MEALS = [
    { type: "Breakfast", item: "Oats with banana", kcal: 420 },
    { type: "Lunch", item: "Chicken rice bowl", kcal: 650 },
    { type: "Snack", item: "Greek yoghurt", kcal: 150 },
    { type: "Dinner", item: "Salmon and vegetables", kcal: 580 },
];

export default function NutritionTracking() {
    return (
        <section className="bg-(--color-bg) px-4 py-24 sm:px-6 sm:py-32">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    index="05"
                    label="Nutrition"
                    title={
                        <>
                            Fuel the <span className="text-(--color-accent)">work</span>
                        </>
                    }
                    description="Log meals, quantities, calories and macros. See your day at a glance."
                />

                <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <ul className="divide-y divide-white/10 border-y border-white/10">
                        {MEALS.map((m) => (
                            <li key={m.type} className="flex items-center justify-between py-4">
                                <div>
                                    <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase">
                                        {m.type}
                                    </p>
                                    <p className="mt-1 text-sm text-white/80">{m.item}</p>
                                </div>
                                <span className="text-sm text-white tabular-nums">{m.kcal} kcal</span>
                            </li>
                        ))}
                        <li className="py-3 text-xs text-white/30">
                            Slot: hover or animated-list effect on these rows
                        </li>
                    </ul>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Slot
                            label="Calorie ring"
                            hint="Search: circular progress"
                            className="h-56"
                        />
                        <Slot
                            label="Macro bars"
                            hint="Protein, carbs, fats. Search: progress bar"
                            className="h-56"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}