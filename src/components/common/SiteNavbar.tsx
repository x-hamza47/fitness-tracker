import { useState } from "react";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
    NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useAuthStore, useIsAuthenticated } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const navItems = [
    { name: "Home", link: "/#home" },
    { name: "Features", link: "/#features" },
    { name: "Workouts", link: "/#workouts" },
    { name: "Nutrition", link: "/#nutrition" },
];

function ForgeLogo() {
    return (
        <a
            href="/"
            className="relative z-20 px-2 py-1 text-lg font-bold tracking-[0.3em] text-white"
        >
            FORGE
        </a>
    );
}

export default function SiteNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();

    return (
        <Navbar>
            {/* Desktop */}
            <NavBody>
                <ForgeLogo />

                <NavItems items={navItems} />


                {isAuthenticated ? (
                    <div className="relative z-20 flex items-center gap-2">
                        <NavbarButton
                            as="button"
                            variant="secondary"
                            className="bg-(--color-accent)"
                            onClick={() => navigate("/dashboard")}
                        >
                            Dashboard
                        </NavbarButton>
                        <NavbarButton as="button" variant="primary" onClick={logout}>
                            Log out
                        </NavbarButton>
                    </div>
                ) : (
                    <NavbarButton variant="primary" href="/auth">
                        Sign in
                    </NavbarButton>
                )}
            </NavBody>

            {/* Mobile */}
            <MobileNav>
                <MobileNavHeader>
                    <ForgeLogo />

                    <MobileNavToggle
                        isOpen={isMobileMenuOpen}
                        onClick={() =>
                            setIsMobileMenuOpen(!isMobileMenuOpen)
                        }
                    />
                </MobileNavHeader>

                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                >
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.link}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full text-white/60 transition-colors hover:text-white"
                        >
                            {item.name}
                        </a>
                    ))}


                    {isAuthenticated ? (
                        <>
                            <NavbarButton
                                as="button"
                                // variant="secondary"
                                className="w-full bg-(--color-accent-dark)"
                                onClick={() => {
                                    navigate("/dashboard");
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Dashboard
                            </NavbarButton>
                            <NavbarButton
                                as="button"
                                variant="primary"
                                className="w-full"
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Log out
                            </NavbarButton>
                        </>
                    ) : (
                        <NavbarButton
                            variant="primary"
                            href="/auth"
                            className="w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Sign in
                        </NavbarButton>
                    )}
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}