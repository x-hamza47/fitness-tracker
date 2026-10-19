import type { Icon } from "@tabler/icons-react";
import type { ReactNode } from "react";

export function WorkoutSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="animate-pulse rounded-sm border border-white/10 bg-white/[0.02] p-5">
                    <div className="h-2.5 w-16 rounded bg-white/10" />
                    <div className="mt-4 h-5 w-40 rounded bg-white/10" />
                    <div className="mt-3 flex gap-2">
                        <div className="h-4 w-14 rounded-full bg-white/10" />
                        <div className="h-4 w-14 rounded-full bg-white/10" />
                    </div>
                    <div className="mt-5 h-10 w-full rounded bg-white/10" />
                    <div className="mt-5 space-y-2">
                        <div className="h-3 w-full rounded bg-white/10" />
                        <div className="h-3 w-5/6 rounded bg-white/10" />
                        <div className="h-3 w-4/6 rounded bg-white/10" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function StateMessage({
    icon: IconComponent,
    title,
    message,
    action,
}: {
    icon: Icon;
    title: string;
    message: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-white/15 px-6 py-16 text-center">
            <IconComponent size={36} stroke={1.25} className="text-white/30" aria-hidden="true" />
            <h2 className="text-sm font-semibold tracking-[0.2em] text-white uppercase">{title}</h2>
            <p className="max-w-sm text-xs text-(--color-text-muted)">{message}</p>
            {action}
        </div>
    );
}