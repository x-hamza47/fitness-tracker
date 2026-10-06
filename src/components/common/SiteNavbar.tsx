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

const navItems = [
    { name: "Features", link: "#features" },
    { name: "Workouts", link: "#workouts" },
    { name: "Nutrition", link: "#nutrition" },
    { name: "Progress", link: "#progress" },
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

    return (
        <Navbar>
            {/* Desktop */}
            <NavBody>
                <ForgeLogo />

                <NavItems items={navItems} />

                <NavbarButton variant="primary">
                    Start Training
                </NavbarButton>
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

                    <NavbarButton
                        variant="primary"
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Start Training
                    </NavbarButton>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}