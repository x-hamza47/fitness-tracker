import { Outlet } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import MobileNav from "./dashboard/MobileNav";
import DotGrid from "@/components/dashboard/DotGrid";
import { useSettings } from "@/features/social/useSettings";

export default function DashboardLayout() {
    useSettings();
    return (
        <div className="min-h-screen bg-(--color-bg) text-(--color-text) lg:flex">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:tracking-[0.15em] focus:text-black focus:uppercase"
            >
                Skip to content
            </a>

            <div className="relative z-20">
                <Sidebar />
            </div>

   
            <div className="relative isolate flex min-h-screen min-w-0 flex-1 flex-col">
                <div className="fixed inset-0 -z-50">
                    <DotGrid
                        baseColor="#463a34"
                        activeColor="#b45309"
                        shape="circle"
                        dotSize={5}
                        gap={18}
                        proximity={140}
                        strength={0.5}
                        bounce={0.4}
                        tension={0.8}
                        returnDuration={1.4}
                        shockRadius={520}
                        shockStrength={5}
                        swell={0.4}
                        stretch={0.2}
                        glow={0.25}
                        fade={0.5}
                        intro
                        opacity={1}
                        mouseInteraction
                        clickShock
                    />
                </div>

                <MobileNav />

                <main id="main-content" className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}