import SectionHeader from "@/pages/public/Home/components/shared/SectionHeader";
import Slot from "@/pages/public/Home/components/shared/Slot";

export default function DashboardPreview() {
    return (
        <section className="bg-(--color-bg) px-4 py-24 sm:px-6 sm:py-32">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    index="06"
                    label="Dashboard"
                    title={
                        <>
                            One view. <span className="text-(--color-accent)">Everything.</span>
                        </>
                    }
                    description="Workouts, nutrition, progress, goals and reminders in one place."
                />

                <div className="mt-12 grid auto-rows-[180px] gap-4 md:grid-cols-3">
                    <Slot
                        label="Progress chart"
                        hint="Search: bento grid, spotlight card"
                        className="md:col-span-2 md:row-span-2"
                    />
                    <Slot label="Today's nutrition" />
                    <Slot label="Recent workouts" />
                    <Slot label="Goals" />
                    <Slot label="Reminders and notifications" className="md:col-span-2" />
                </div>
            </div>
        </section>
    );
}