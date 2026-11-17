import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "@/features/profile/useProfile";
import { isProfileComplete } from "@/lib/profileComplete";
import { toast } from "sonner";

export default function ProfileGate() {
    const { profile, isLoading } = useProfile();
    const hasToastedRef = useRef(false);

    const complete = isProfileComplete(profile);

    useEffect(() => {
        if (!isLoading && profile && !complete && !hasToastedRef.current) {
            hasToastedRef.current = true;
            toast.info("Please complete your fitness details (weight, height, age, goal) to access this page.");
        }
    }, [isLoading, profile, complete]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl space-y-4 p-4">
                <div className="h-48 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                <div className="h-64 animate-pulse rounded-sm border border-white/10 bg-white/2" />
            </div>
        );
    }

    if (!complete) {
        return <Navigate to="/dashboard/profile" replace />;
    }

    return <Outlet />;
}
