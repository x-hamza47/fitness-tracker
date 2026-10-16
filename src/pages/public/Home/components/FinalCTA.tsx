import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { IconArrowUpRight } from "@tabler/icons-react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import hamza from "@/assets/team/hamza.webp";
import member2 from "@/assets/team/husnain.webp";
import member3 from "@/assets/team/hasnain.webp";

const team = [
    { id: 1, name: "Hamza Aamir", designation: "Full-Stack Developer", image: hamza },
    { id: 2, name: "Hasnain Afridi", designation: "Frontend Developer", image: member2 },
    { id: 3, name: "Hasnain", designation: "Backend Developer", image: member3 },
    { id: 4, name: "Zain Afridi", designation: "UI/UX Designer" }, 
];

export default function FinalCTA() {
    return (
        <section
            id="get-started"
            className="relative w-full overflow-hidden border-y border-white/10 bg-[#070709] px-4 py-10 sm:px-6 sm:py-14"
        >
            {/* Glow from the right edge */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(50% 140% at 90% 50%, rgb(255 106 0 / 0.2), transparent 70%)",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative mx-auto flex max-w-7xl flex-col gap-8"
            >
                {/* Team */}
                <div className="flex flex-col items-start gap-3">
                    <span className="text-[10px] font-medium tracking-[0.25em] text-(--color-text-muted) uppercase sm:text-xs">
                        The team behind Forge
                    </span>
                    <div className="flex flex-row items-center">
                        <AnimatedTooltip items={team} />
                    </div>
                </div>

                <div className="h-px w-full bg-linear-to-r from-(--color-accent-dark) via-(--color-accent-dark)/30 to-transparent" />

                {/* CTA row */}
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl leading-tight font-semibold tracking-tighter text-(--color-text) uppercase sm:text-3xl">
                            Stop guessing.{" "}
                            <span className="text-(--color-accent-dark)">Start forging.</span>
                        </h2>
                        <p className="mt-2 text-sm text-(--color-text-muted)">
                            Every rep, every meal, every session in one place.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Link
                            to="/register"
                            className="group/btn flex items-center justify-center gap-2 rounded-sm bg-(--color-accent-dark) px-6 py-3 text-sm font-bold tracking-wide text-black uppercase shadow-[0_8px_30px_-8px_rgb(255_106_0/0.6)] transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            Start tracking
                            <IconArrowUpRight
                                size={16}
                                aria-hidden="true"
                                className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                            />
                        </Link>
                        <a
                            href="#features"
                            className="flex items-center justify-center rounded-sm border border-white/15 px-6 py-3 text-sm font-semibold tracking-wide text-white/70 uppercase transition-colors hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            See features
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}