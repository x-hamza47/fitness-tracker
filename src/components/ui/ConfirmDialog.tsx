import { useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOverlay } from "@/hooks/useOverlay";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isPending?: boolean;
    errorMessage?: string | null;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Delete",
    isPending = false,
    errorMessage,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    useOverlay(open, onCancel, panelRef);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onCancel}
                        aria-hidden="true"
                    />

                    <motion.div
                        ref={panelRef}
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        tabIndex={-1}
                        className="relative w-full max-w-sm rounded-sm border border-white/10 bg-[#0b0b0d] p-6 outline-none"
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.15 }}
                    >
                        <h2 id={titleId} className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
                            {title}
                        </h2>
                        <p className="mt-3 text-sm text-(--color-text-muted)">{message}</p>

                        {errorMessage && (
                            <p role="alert" className="mt-3 text-xs text-red-400">
                                {errorMessage}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={isPending}
                                className="cursor-pointer rounded-sm border border-white/15 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isPending}
                                className="cursor-pointer rounded-sm bg-red-500 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-red-400 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:opacity-50"
                            >
                                {isPending ? "Deleting..." : confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}