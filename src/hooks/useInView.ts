import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element>(rootMargin = "200px", once = false) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setInView(true);
                    if (once) io.disconnect();
                } else if (!once) {
                    setInView(false);
                }
            },
            { rootMargin }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin, once]);

    return [ref, inView] as const;
}