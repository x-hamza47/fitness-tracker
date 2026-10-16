import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import TrainingProgress from "./components/TrainingProgress";
import NutritionTracking from "./components/NutritionTracking";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
    return (
        <>
            <Hero />
            <Manifesto />
            <TrainingProgress />
            <NutritionTracking />
            <FinalCTA />
            <Footer/>
        </>
    );
}