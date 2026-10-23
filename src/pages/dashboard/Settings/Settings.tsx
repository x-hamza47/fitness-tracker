import type { ReactNode } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useProfile } from "@/features/profile/useProfile";
import { useSettings, useUpdateSettings } from "@/features/social/useSettings";
import { cn } from "@/lib/utils";
import type { UnitSystem } from "@/types/profile";
import Toggle from "./components/Toggle";

const UNIT_OPTIONS: { value: UnitSystem; label: string; hint: string }[] = [
    { value: "metric", label: "Metric", hint: "kg, cm" },
    { value: "imperial", label: "Imperial", hint: "lb, in" },
];

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return (
        <section className="rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">{title}</h2>
            <p className="mt-1 text-xs text-(--color-text-muted)">{description}</p>
            <div className="mt-3 divide-y divide-white/10">{children}</div>
        </section>
    );
}

export default function Settings() {
    const { settings, isLoading, isError, refetch } = useSettings();
    const { profile } = useProfile();
    const { submit, isPending } = useUpdateSettings();

    if (isLoading) {
        return (
            <div aria-hidden="true" className="mx-auto max-w-3xl space-y-4">
                <div className="h-32 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                <div className="h-56 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                <div className="h-56 animate-pulse rounded-sm border border-white/10 bg-white/2" />
            </div>
        );
    }

    if (isError || !settings) {
        return (
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-sm border border-dashed border-white/15 px-6 py-16 text-center">
                <IconAlertTriangle size={36} stroke={1.25} className="text-white/30" aria-hidden="true" />
                <h2 className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
                    Couldn't load your settings
                </h2>
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

    const isAdmin = profile?.role === "admin";
    const { units, notifications, privacy } = settings;

    return (
        <div className="mx-auto max-w-3xl space-y-4">
            <header>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Account</p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Settings</h1>
                <p className="mt-1 text-sm text-(--color-text-muted)">
                    Changes are saved as soon as you make them.
                </p>
            </header>

            <Section title="Units" description="How weight and measurements are shown across the app.">
                <div role="radiogroup" aria-label="Unit system" className="grid grid-cols-2 gap-3 py-3">
                    {UNIT_OPTIONS.map((o) => (
                        <button
                            key={o.value}
                            type="button"
                            role="radio"
                            aria-checked={units === o.value}
                            disabled={isPending}
                            onClick={() => units !== o.value && submit({ units: o.value })}
                            className={cn(
                                "cursor-pointer rounded-sm border px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
                                units === o.value
                                    ? "border-(--color-accent) bg-(--color-accent)/10"
                                    : "border-white/10 hover:bg-white/5",
                            )}
                        >
                            <p className="text-sm font-semibold text-white">{o.label}</p>
                            <p className="mt-0.5 text-xs text-(--color-text-muted)">{o.hint}</p>
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Notifications" description="Choose which reminders and alerts you receive.">
                <Toggle
                    label="Workout alerts"
                    description="Workout completions and reminders."
                    checked={notifications.workout}
                    disabled={isPending}
                    onChange={(v) => submit({ notifications: { workout: v } })}
                />
                <Toggle
                    label="Meal reminders"
                    description="Reminders to log your meals."
                    checked={notifications.meal}
                    disabled={isPending}
                    onChange={(v) => submit({ notifications: { meal: v } })}
                />
                <Toggle
                    label="Goal alerts"
                    description="When you reach or get close to a goal."
                    checked={notifications.goal}
                    disabled={isPending}
                    onChange={(v) => submit({ notifications: { goal: v } })}
                />
            </Section>

            {!isAdmin && (
                <Section title="Privacy" description="Control who can find you and what they can see.">
                    <Toggle
                        label="Private account"
                        description="New followers must be approved by you. Non-followers only see your name, photo and username."
                        checked={privacy.isPrivate}
                        disabled={isPending}
                        onChange={(v) => submit({ privacy: { isPrivate: v } })}
                    />
                    <Toggle
                        label="Show in search"
                        description="Let other users find you by name or username."
                        checked={privacy.searchable}
                        disabled={isPending}
                        onChange={(v) => submit({ privacy: { searchable: v } })}
                    />
                    <Toggle
                        label="Show fitness stats"
                        description="Let your followers see your stats."
                        checked={privacy.showStats}
                        disabled={isPending}
                        onChange={(v) => submit({ privacy: { showStats: v } })}
                    />
                </Section>
            )}
        </div>
    );
}