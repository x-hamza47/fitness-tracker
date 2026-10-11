type Props = {
    label: string;
    hint?: string;
    className?: string;
};

export default function Slot({ label, hint, className = "" }: Props) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/2 p-6 text-center ${className}`}
        >
            <span className="text-[10px] tracking-[0.25em] text-(--color-accent) uppercase">
                Slot
            </span>
            <span className="text-sm font-medium text-white/80">{label}</span>
            {hint && <span className="max-w-xs text-xs text-white/40">{hint}</span>}
        </div>
    );
}