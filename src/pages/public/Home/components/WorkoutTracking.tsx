import { IconBarbell, IconHistory, IconListDetails, IconTags } from "@tabler/icons-react";
import SectionHeader from "@/pages/public/Home/components/shared/SectionHeader";
import Slot from "@/pages/public/Home/components/shared/Slot";

const FEATURES = [
    { icon: IconListDetails, text: "Build routines: exercise, sets, reps, weight, notes" },
    { icon: IconTags, text: "Organise by category (strength, cardio) and tags" },
    { icon: IconBarbell, text: "Log each set and compare with your previous session" },
    { icon: IconHistory, text: "Full workout history you can search and filter" },
];

export default function WorkoutTracking() {
    return (
        <section className="bg-(--color-bg) px-4 py-24 sm:px-6 sm:py-32">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <SectionHeader
                        index="03"
                        label="Workout tracking"
                        title={
                            <>
                                Log every <span className="text-(--color-accent)">set</span>
                            </>
                        }
                        description="Routines, sets, reps and weights, logged fast and compared against last time."
                    />
                    <ul className="mt-10 space-y-5">
                        {FEATURES.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-4 text-sm text-white/70">
                                <Icon size={18} stroke={1.75} className="mt-0.5 shrink-0 text-(--color-accent)" />
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-7">
                    <Slot
                        label="App screen / scroll animation"
                        hint="Search: container scroll, sticky scroll, device mockup. Show a workout log."
                        className="h-105 lg:h-130"
                    />
                </div>
            </div>
        </section>
    );
}