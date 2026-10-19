import type { ReactNode } from "react";

export const INPUT =
    "mt-1.5 w-full rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none";
export const SELECT = `${INPUT} cursor-pointer [color-scheme:dark]`;
export const LABEL = "text-[10px] tracking-[0.2em] text-white/50 uppercase";

export function Field({
    label,
    error,
    children,
    className,
}: {
    label: string;
    error?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <label className="block">
                <span className={LABEL}>{label}</span>
                {children}
            </label>
            {error && (
                <p role="alert" className="mt-1 text-xs text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}