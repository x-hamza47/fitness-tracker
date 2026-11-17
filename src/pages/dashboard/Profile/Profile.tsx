import { IconAlertTriangle } from "@tabler/icons-react";
import { useProfile } from "@/features/profile/useProfile";
import AccountForm from "./components/AccountForm";
import FitnessForm from "./components/FitnessForm";
import ProfileHeader from "./components/ProfileHeader";

export default function Profile() {
    const { profile, isLoading, isError, refetch } = useProfile();

    if (isLoading) {
        return (
            <div aria-hidden="true" className="mx-auto max-w-4xl space-y-4">
                <div className="h-56 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                <div className="h-64 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                <div className="h-80 animate-pulse rounded-sm border border-white/10 bg-white/2" />
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-white/15 px-6 py-16 text-center">
                <IconAlertTriangle size={36} stroke={1.25} className="text-white/30" aria-hidden="true" />
                <h2 className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
                    Couldn't load your profile
                </h2>
                <p className="max-w-sm text-xs text-(--color-text-muted)">
                    Something went wrong while fetching your profile.
                </p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="cursor-pointer rounded-sm bg-(--color-accent) px-4 py-2.5 text-[10px] font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90"
                >
                    Try again
                </button>
            </div>
        );
    }

    const isAdmin = profile.role === "admin";


    return (
        <div className="mx-auto max-w-4xl space-y-4">
            <ProfileHeader profile={profile} />
            <AccountForm  profile={profile} />
            {!isAdmin && <FitnessForm  profile={profile} />}
        </div>
    );
}