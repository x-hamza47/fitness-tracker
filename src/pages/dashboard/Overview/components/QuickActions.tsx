import type { Icon } from "@tabler/icons-react";
import { IconBarbell, IconScale, IconToolsKitchen2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const ACTIONS: { label: string; to: string; icon: Icon }[] = [
    { label: "Log workout", to: "/dashboard/workouts", icon: IconBarbell },
    { label: "Log meal", to: "/dashboard/nutrition", icon: IconToolsKitchen2 },
    { label: "Add progress", to: "/dashboard/progress", icon: IconScale },
];

export default function QuickActions() {
    return (
        <div className="flex flex-wrap gap-2">
            {ACTIONS.map(({ label, to, icon: IconComponent }) => (
                <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 rounded-sm border border-white/15 px-3.5 py-2 text-[10px] font-semibold tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                    <IconComponent size={16} stroke={1.5} aria-hidden="true" />
                    {label}
                </Link>
            ))}
        </div>
    );
}