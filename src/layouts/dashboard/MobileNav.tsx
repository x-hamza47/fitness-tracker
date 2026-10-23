import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { useProfile } from "@/features/profile/useProfile";
import { Logo, SidebarContent } from "./Sidebar";
import { MOBILE_TABS, PROFILE_PATH } from "./navigation";

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
    // Lock body scroll and close on Escape while the drawer is open
    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
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
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/10 bg-[#0b0b0d] p-5"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close menu"
                            className="absolute top-4 right-4 cursor-pointer p-2 text-white/60 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            <IconX size={20} stroke={1.5} aria-hidden="true" />
                        </button>

                        <SidebarContent onNavigate={onClose} />
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}

function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
    const { profile } = useProfile();

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0b0b0d] px-4 py-3 lg:hidden">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="-ml-2 cursor-pointer p-2 text-white/60 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    <IconMenu2 size={22} stroke={1.5} aria-hidden="true" />
                </button>
                <Logo />
            </div>

            <Link to={PROFILE_PATH} aria-label="View your profile">
                <Avatar name={profile?.name ?? "Athlete"} src={profile?.profilePicture} size="sm" ring />
            </Link>
        </header>
    );
}

function MobileTabBar() {
    return (
        <nav
            aria-label="Main"
            className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-white/10 bg-[#0b0b0d] pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
            {MOBILE_TABS.map(({ name, to, icon: Icon, end }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                        cn(
                            "flex flex-col items-center gap-1 py-3 text-[10px] tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                            isActive ? "text-(--color-accent)" : "text-white/50",
                        )
                    }
                >
                    <Icon size={20} stroke={1.5} aria-hidden="true" />
                    {name}
                </NavLink>
            ))}
        </nav>
    );
}

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();
    const [lastPath, setLastPath] = useState(pathname);

    // Close the drawer when the route changes (back button, programmatic navigation).
    // Adjusting state during render avoids an effect and an extra paint.
    if (pathname !== lastPath) {
        setLastPath(pathname);
        setOpen(false);
    }

    const close = () => setOpen(false);

    return (
        <>
            <MobileTopBar onMenuClick={() => setOpen(true)} />
            <MobileTabBar />
            <MobileDrawer open={open} onClose={close} />
        </>
    );
}