import type { ReactNode } from "react";

type MagicButtonProps = {
    title: string;
    icon?: ReactNode;
    position?: "left" | "right";
    className?: string;
    handleClick?: () => void;
};

export default function MagicButton({
    title,
    icon,
    position,
    className,
    handleClick,
}: MagicButtonProps) {
    return (
        <button
            className={`relative inline-flex h-11 w-full overflow-hidden rounded-lg p-px focus:outline-none focus:ring-2 focus:ring-(--color-accent)/40 md:h-12 md:w-60 ${className ?? ""}`}
            onClick={handleClick}
        >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-accent)_50%,transparent_100%)]" />

            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-(--color-bg) px-6 text-sm font-medium text-white backdrop-blur-3xl md:px-8 md:text-base">
                {position === "left" && icon}

                {title}

                {position === "right" && icon}
            </span>
        </button>
    );
}