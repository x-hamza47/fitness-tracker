import { useState } from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "./avatar.utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarProps = {
    /** Used for the initials fallback and the image alt text */
    name: string;
    /** null or undefined shows the initials fallback */
    src?: string | null;
    size?: AvatarSize;
    /** Adds an accent ring, useful for the "current user" avatar */
    ring?: boolean;
    className?: string;
};

const SIZE_CLASSES: Record<AvatarSize, string> = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-14 text-base",
    xl: "size-24 text-2xl",
};



export default function Avatar({
    name,
    src,
    size = "md",
    ring = false,
    className,
}: AvatarProps) {
    // Remember which src failed, so a new src gets a fresh attempt
    // without needing an effect to reset state.
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const showImage = !!src && src !== failedSrc;

    return (
        <span
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 font-semibold tracking-wide text-white select-none",
                ring && "ring-2 ring-(--color-accent) ring-offset-2 ring-offset-[#0b0b0d]",
                SIZE_CLASSES[size],
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={name}
                    onError={() => setFailedSrc(src)}
                    className="size-full object-cover"
                    draggable={false}
                />
            ) : (
                <span aria-label={name}>{getInitials(name)}</span>
            )}
        </span>
    );
}