import { useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { useOverlay } from "@/hooks/useOverlay";

type DrawerProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    /** Pinned bottom bar, e.g. Save / Cancel buttons */
    footer?: ReactNode;
    children: ReactNode;
};

export default function Drawer({ open, onClose, title, description, footer, children }: DrawerProps) {
    const titleId = useId();
    const panelRef = useRef<HTMLElement>(null);
    useOverlay(open, onClose, panelRef);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50">
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.aside
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        tabIndex={-1}
                        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#0b0b0d] outline-none"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                    >
                        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
                            <div className="min-w-0">
                                <h2 id={titleId} className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
                                    {title}
                                </h2>
                                {description && (
                                    <p className="mt-1 text-xs text-(--color-text-muted)">{description}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="-mr-2 cursor-pointer p-2 text-white/60 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                            >
                                <IconX size={20} stroke={1.5} aria-hidden="true" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

                        {footer && (
                            <footer className="border-t border-white/10 bg-[#0b0b0d] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                                {footer}
                            </footer>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}