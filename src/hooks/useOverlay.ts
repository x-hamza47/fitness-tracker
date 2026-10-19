import { useEffect, type RefObject } from "react";

export function useOverlay(
    open: boolean,
    onClose: () => void,
    panelRef?: RefObject<HTMLElement | null>,
) {
    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        panelRef?.current?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose, panelRef]);
}