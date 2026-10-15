import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export function useAnimatedNumber(target: number, duration = 900) {
    const reduce = useReducedMotion();
    const [value, setValue] = useState(target);
    const from = useRef(target);

    useEffect(() => {
        if (reduce) {
            from.current = target;

            const frame = requestAnimationFrame(() => {
                setValue(target);
            });

            return () => cancelAnimationFrame(frame);
        }
        const start = performance.now();
        const initial = from.current;
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const v = initial + (target - initial) * (1 - Math.pow(1 - t, 3));
            setValue(v);
            from.current = v;
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration, reduce]);

    return Math.round(value);
}