import { useId, useState, type ComponentProps } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface FormFieldProps extends ComponentProps<"input"> {
    label: string;
    error?: string;
}

export default function FormField({
    label,
    error,
    type = "text",
    id,
    className = "",
    ref,
    ...rest
}: FormFieldProps) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;

    const isPassword = type === "password";
    const [visible, setVisible] = useState(false);
    const inputType = isPassword && visible ? "text" : type;

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={inputId}
                className="text-[11px] tracking-[0.2em] text-white/50 uppercase"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    ref={ref}
                    id={inputId}
                    type={inputType}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`w-full rounded-sm border bg-(--color-surface) px-3.5 py-3 text-sm text-(--color-text) placeholder:text-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent-dark) ${
                        error
                            ? "border-red-500/60"
                            : "border-white/10 hover:border-white/20"
                    } ${isPassword ? "pr-11" : ""} ${className}`}
                    {...rest}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? "Hide password" : "Show password"}
                        aria-pressed={visible}
                        className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-white/40 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
                    >
                        {visible ? (
                            <IconEyeOff size={18} stroke={1.5} aria-hidden="true" />
                        ) : (
                            <IconEye size={18} stroke={1.5} aria-hidden="true" />
                        )}
                    </button>
                )}
            </div>

            <p
                id={errorId}
                role={error ? "alert" : undefined}
                className="min-h-4 text-xs leading-4 text-red-400"
            >
                {error}
            </p>
        </div>
    );
}