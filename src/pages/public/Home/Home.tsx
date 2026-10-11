import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import WorkoutTracking from "./components/WorkoutTracking";
import ProgressAnalytics from "./components/ProgressAnalytics";
import NutritionTracking from "./components/NutritionTracking";
import DashboardPreview from "./components/DashboardPreview";
import FinalCTA from "./components/FinalCTA";

export default function Home() {
    return (
        <>
            <Hero />
            <Manifesto />
            <WorkoutTracking />
            <ProgressAnalytics />
            <NutritionTracking />
            <DashboardPreview />
            <FinalCTA />
        </>
    );
}