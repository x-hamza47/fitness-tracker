import { useEffect, useRef, useState } from "react";
import type { Icon } from "@tabler/icons-react";
import { IconDots } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type ActionMenuItem = {
    label: string;
    icon: Icon;
    onClick: () => void;
    danger?: boolean;
};

export default function ActionMenu({ items, label }: { items: ActionMenuItem[]; label: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const onMouseDown = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onMouseDown);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative z-9999">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={label}
                aria-haspopup="menu"
                aria-expanded={open}
                className="cursor-pointer rounded-sm p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
                <IconDots size={18} stroke={1.5} aria-hidden="true" />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute top-full right-0 z-9999 mt-1 w-40 rounded-sm border border-white/15 bg-[#0b0b0d] p-1 shadow-xl shadow-black/50"
                >
                    {items.map(({ label: itemLabel, icon: IconComponent, onClick, danger }) => (
                        <button
                            key={itemLabel}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setOpen(false);
                                onClick();
                            }}
                            className={cn(
                                "flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                                danger
                                    ? "text-red-400 hover:bg-red-500/10"
                                    : "text-white/70 hover:bg-white/10 hover:text-white",
                            )}
                        >
                            <IconComponent size={16} stroke={1.5} aria-hidden="true" />
                            {itemLabel}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}