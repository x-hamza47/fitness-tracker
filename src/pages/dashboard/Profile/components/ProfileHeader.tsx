import { useRef, useState } from "react";
import { IconCamera, IconTrash } from "@tabler/icons-react";
import Avatar from "@/components/ui/Avatar";
import { useUpdateProfile } from "@/features/profile/useProfile";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/profile";
import { avatarSchema } from "@/schemas/profileSchema";


const BUTTON =
    "flex cursor-pointer items-center gap-2 rounded-sm border border-white/20 px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

function Stat({ value, label }: { value: number; label: string }) {
    return (
        <div className="min-w-0 rounded-sm border border-white/10 bg-white/2 px-2 py-3 text-center sm:px-4">
            <p className="text-lg font-semibold text-white tabular-nums sm:text-xl">{value}</p>
            <p className="mt-0.5 truncate text-[9px] tracking-widest text-white/50 uppercase sm:text-[10px] sm:tracking-[0.2em]">
                {label}
            </p>
        </div>
    );
}
export default function ProfileHeader({ profile }: { profile: UserProfile }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const { submit, isPending, errorMessage } = useUpdateProfile();

    const isAdmin = profile.role === "admin";
    const error = localError ?? errorMessage;

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        const result = avatarSchema.safeParse(file);
        if (!result.success) {
            setLocalError(result.error.issues[0].message);
            return;
        }
        setLocalError(null);
        submit({ avatar: result.data });
    };

    const handleRemove = () => {
        setLocalError(null);
        submit({ avatar: null });
    };

    const joined = new Date(profile.createdAt).toLocaleDateString("en", {
        month: "long",
        year: "numeric",
    });

    return (
        <section
            aria-label="Profile"
            className="rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm sm:p-6"
        >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar name={profile.name} src={profile.profilePicture} size="xl" ring />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="truncate text-2xl font-semibold text-white">{profile.name}</h1>
                        <span
                            className={cn(
                                "rounded-sm px-2 py-0.5 text-[10px] font-semibold tracking-[0.15em] uppercase",
                                isAdmin
                                    ? "bg-(--color-accent) text-black"
                                    : "border border-white/20 text-white/60",
                            )}
                        >
                            {profile.role}
                        </span>
                    </div>
                    <p className="text-sm text-(--color-text-muted)">@{profile.username}</p>
                    <p className="mt-1 text-xs text-white/40">
                        {profile.email} · Member since {joined}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={isPending}
                            className={BUTTON}
                        >
                            <IconCamera size={16} stroke={1.75} aria-hidden="true" />
                            {isPending ? "Uploading..." : "Change photo"}
                        </button>
                        {profile.profilePicture && (
                            <button type="button" onClick={handleRemove} disabled={isPending} className={BUTTON}>
                                <IconTrash size={16} stroke={1.75} aria-hidden="true" />
                                Remove
                            </button>
                        )}
                    </div>

                    {error && (
                        <p role="alert" className="mt-3 text-xs text-red-400">
                            {error}
                        </p>
                    )}
                </div>
            </div>

            {!isAdmin && (
                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                    <Stat value={profile.stats.followers} label="Followers" />
                    <Stat value={profile.stats.following} label="Following" />
                    <Stat value={profile.stats.workouts} label="Workouts" />
                </div>
            )}
        </section>
    );
}