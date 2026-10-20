import { motion } from "motion/react";

const ORBS = [
    { className: "-top-24 left-[8%] size-96 bg-[#ff6a00]/25", x: [0, 40, 0], y: [0, 30, 0], d: 14 },
    { className: "top-40 right-[5%] size-[28rem] bg-[#ff3d00]/15", x: [0, -50, 0], y: [0, 40, 0], d: 18 },
    { className: "top-[28rem] left-[35%] size-80 bg-[#facc15]/10", x: [0, 30, 0], y: [0, -40, 0], d: 16 },
];


export default function AmbientBackground() {
    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {ORBS.map((orb, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full blur-3xl motion-reduce:animate-none ${orb.className}`}
                    animate={{ x: orb.x, y: orb.y }}
                    transition={{ duration: orb.d, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        </div>
    );
}