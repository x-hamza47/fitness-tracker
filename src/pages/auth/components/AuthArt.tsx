import dashboardPreview from "@/assets/dashboard-preview.jpeg";
import forgeLogo from "@/assets/forge-logo.webp";

type Variant = "login" | "register";

const COPY = {
    login: {
        title: ["YOUR NEXT", "PR STARTS", "HERE."],
        accent: "PR STARTS",
        description: "Your progress doesn't happen by accident.",
    },
    register: {
        title: ["BUILD THE", "HABIT.", "OWN IT."],
        accent: "HABIT.",
        description: "Start building a stronger version of yourself.",
    },
} as const;

export default function AuthArt({
    variant,
}: {
    variant: Variant;
}) {
    const {  title, accent, description } = COPY[variant];

    return (
        <aside
            aria-hidden="true"
            className="relative hidden w-[46%] shrink-0 overflow-hidden bg-[#11100f] text-white lg:block"
        >
            {/* Technical grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            to right,
                            rgb(255 255 255 / 0.045) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            to bottom,
                            rgb(255 255 255 / 0.045) 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "36px 36px",
                }}
            />

            {/* Orange ambient light */}
            <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--color-accent)] opacity-15 blur-[120px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-600/10 blur-[100px]" />

            {/* Oversized watermark */}
            <span
                className="pointer-events-none absolute -right-8 bottom-4 select-none text-[clamp(8rem,16vw,15rem)] leading-none font-black tracking-[-0.1em] text-transparent"
                style={{
                    WebkitTextStroke: "1px rgb(255 255 255 / 0.10)",
                }}
            >
                FORGE
            </span>

            <div className="relative flex h-full min-h-[620px] flex-col p-8 xl:p-10">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-cente">
                            <img src={forgeLogo} alt="Forge" />
                        </div>

                        <span className="text-sm font-black tracking-[0.3em]">
                            FORGE
                        </span>
                    </div>

                </div>

                {/* Headline */}
                <div className="relative z-10 mt-14 xl:mt-16">
                      <h2 className="text-5xl leading-[0.98] font-black tracking-[-0.065em] uppercase xl:text-6xl 2xl:text-7xl">
                        {title.map((line) => (
                            <span
                                key={line}
                                className={`block ${
                                    line === accent
                                        ? "text-[var(--color-accent)]"
                                        : "text-white"
                                }`}
                            >
                                {line}
                            </span>
                        ))}
                    </h2>

                    <p className="mt-6 max-w-xs text-sm leading-6 text-white/55">
                        {description}
                    </p>
                </div>

                {/* Dashboard preview */}
                <div className="relative mt-auto pt-12">
                    {/* Floating label */}
                    <div className="absolute top-5 left-0 z-20 flex items-center gap-3 rounded-xl border border-white/10 bg-[#1b1a18]/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5"
                            >
                                <path
                                    d="M4 19V5m0 14h16M8 15l4-5 3 2 5-7"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-white">
                                Your journey
                            </p>
                            <p className="mt-1 text-[10px] text-white/45">
                                One rep at a time
                            </p>
                        </div>
                    </div>

                    {/* Image frame */}
                    <div className="relative ml-8 translate-y-5 rotate-[-4deg] overflow-hidden rounded-xl border border-white/15 bg-[#181716] shadow-[0_25px_80px_-20px_rgb(0_0_0/0.8)] transition-transform duration-700 hover:rotate-[-2deg]">
                        <div className="flex h-9 items-center gap-1.5 border-b border-white/10 bg-[#1c1b19] px-4">
                            <span className="h-2 w-2 rounded-full bg-red-400/70" />
                            <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                            <span className="h-2 w-2 rounded-full bg-green-400/70" />

                            <span className="ml-3 text-[9px] tracking-widest text-white/30">
                                FORGE / DASHBOARD
                            </span>
                        </div>

                        <img
                            src={dashboardPreview}
                            alt=""
                            className="block w-full"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#11100f]/30 via-transparent to-transparent" />
                    </div>

                    {/* Bottom caption */}
                    <div className="relative z-10 mt-10 flex items-center justify-between border-t border-white/10 pt-5">
                        <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
                            Discipline over motivation.
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                            <span className="text-[10px] tracking-wider text-white/55">
                                YOUR PACE. YOUR RULES.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
