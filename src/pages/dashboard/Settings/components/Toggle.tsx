import { cn } from "@/lib/utils";

type ToggleProps = {
    label: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
};

export default function Toggle({ label, description, checked, disabled, onChange }: ToggleProps) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
                <p className="text-sm text-white">{label}</p>
                {description && <p className="mt-0.5 text-xs text-(--color-text-muted)">{description}</p>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    checked ? "bg-(--color-accent)" : "bg-white/15",
                )}
            >
                <span
                    className={cn(
                        "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
                        checked && "translate-x-5",
                    )}
                />
            </button>
        </div>
    );
}