import {
    IconArrowUpRight,
    IconBrandGithub,
    IconBrandLinkedin,
    IconWorld,
    IconArrowUp,
} from "@tabler/icons-react";
import forgeLogo from "@/assets/forge-logo.webp";

const FOOTER_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Nutrition", href: "#nutrition" },
    { label: "Get Started", href: "#get-started" },
];

type Developer = {
    name: string;
    role: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
};

const DEVELOPERS: Developer[] = [
    {
        name: "Hamza Aamir",
        role: "Full-Stack Developer",
        github: "https://github.com/x-hamza47",
        linkedin: "https://www.linkedin.com/in/hamza-aamir-dev/",
        portfolio: "https://hamzaamir-portfolio.web.app/",
    },
    { name: "Hasnain Afridi", role: "Frontend Developer" },
    { name: "Hasnain", role: "Backend Developer" },
    { name: "Zain Afridi", role: "UI/UX Designer" },
];

const LEAD = DEVELOPERS[0];

function IconLink({
    href,
    label,
    children,
}: {
    href: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={label}
            title={label}
            className="grid size-8 place-items-center border border-white/10 text-white/50 transition-colors hover:border-(--color-accent-dark)/50 hover:text-(--color-accent-dark) focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
            {children}
        </a>
    );
}

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/10 bg-[#070707] px-4 pt-12 pb-6 sm:px-6 sm:pt-16">
            {/* Ambient accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 h-64 w-lg -translate-x-1/2 rounded-full bg-orange-600/[0.07] blur-[100px]"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1.3fr] lg:gap-16">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <a
                            href="#home"
                            aria-label="Forge home"
                            className="group inline-flex items-center gap-2"
                        >
                            <img
                                src={forgeLogo}
                                alt="Forge logo"
                                width={128}
                                height={128}
                                className="size-9 object-contain"
                            />
                            <span className="text-xl font-black tracking-[0.2em] text-white">
                                FORGE
                            </span>
                        </a>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-white/45">
                            A fitness tracker built to help you organize
                            workouts, monitor nutrition, and measure your
                            progress over time.
                        </p>

                        <p className="mt-5 text-[10px] font-medium tracking-[0.22em] text-(--color-accent-dark) uppercase">
                            Train with purpose. Track your progress.
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav aria-label="Footer navigation">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
                            Explore
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {FOOTER_LINKS.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="group inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
                                    >
                                        {item.label}
                                        <IconArrowUpRight
                                            size={13}
                                            aria-hidden="true"
                                            className="opacity-0 transition-opacity group-hover:opacity-100"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Team */}
                    <div>
                        <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
                            The Team
                        </h2>

                        <ul className="mt-5 space-y-4">
                            {DEVELOPERS.map((dev) => (
                                <li
                                    key={dev.name + dev.role}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        {dev.portfolio ? (
                                            <a
                                                href={dev.portfolio}
                                                target="_blank"
                                                rel="me noopener noreferrer"
                                                className="text-sm font-semibold tracking-tight text-white transition-colors hover:text-(--color-accent-dark)"
                                            >
                                                {dev.name}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-semibold tracking-tight text-white">
                                                {dev.name}
                                            </p>
                                        )}
                                        <p className="mt-0.5 text-xs text-white/40">
                                            {dev.role}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        {dev.github && (
                                            <IconLink href={dev.github} label={`${dev.name} on GitHub`}>
                                                <IconBrandGithub size={16} aria-hidden="true" />
                                            </IconLink>
                                        )}
                                        {dev.linkedin && (
                                            <IconLink href={dev.linkedin} label={`${dev.name} on LinkedIn`}>
                                                <IconBrandLinkedin size={16} aria-hidden="true" />
                                            </IconLink>
                                        )}
                                        {dev.portfolio && (
                                            <IconLink href={dev.portfolio} label={`${dev.name}'s portfolio`}>
                                                <IconWorld size={16} aria-hidden="true" />
                                            </IconLink>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/35">
                        © {new Date().getFullYear()} Forge. All rights reserved.
                    </p>

                    <p className="text-xs text-white/35">
                        Designed and developed by{" "}
                        <a
                            href={LEAD.portfolio}
                            target="_blank"
                            rel="me noopener noreferrer"
                            className="font-medium text-white/70 underline decoration-white/20 underline-offset-4 transition-colors hover:text-(--color-accent-dark)"
                        >
                            {LEAD.name}
                        </a>
                    </p>

                    <a
                        href="#home"
                        className="inline-flex items-center gap-2 self-start text-xs font-semibold tracking-widest text-white/50 uppercase transition-colors hover:text-(--color-accent-dark) sm:self-auto"
                    >
                        Back to top
                        <IconArrowUp size={14} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </footer>
    );
}