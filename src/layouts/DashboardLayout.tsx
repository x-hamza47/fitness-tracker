import { Outlet } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import MobileNav from "./dashboard/MobileNav";
// import AmbientBackground from "@/components/dashboard/AmbientBackground";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-(--color-bg) text-(--color-text) lg:flex">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:tracking-[0.15em] focus:text-black focus:uppercase"
            >
                Skip to content
            </a>

            {/* Desktop only (hidden below lg) */}
            <Sidebar />

            {/* relative + isolate: the background fills this whole column and stays behind its content */}
            <div className="relative isolate flex min-h-screen min-w-0 flex-1 flex-col">
                {/* <AmbientBackground /> */}

                {/* Mobile only: top bar, bottom tabs and drawer (hidden at lg and up) */}
                <MobileNav />

                <main id="main-content" className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}