import { lazy, memo, Suspense } from "react";
import BallFallback from "./BallFallback";

const CrystalizedBall = lazy(() => import("@/components/ui/CrystalizedBall"));

const FuelBall = memo(function FuelBall() {
    return (
        <Suspense fallback={<BallFallback />}>
            <CrystalizedBall preset="ember" />
        </Suspense>
    );
});

export default FuelBall;