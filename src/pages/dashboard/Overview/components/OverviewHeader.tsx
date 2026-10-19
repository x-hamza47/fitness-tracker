import QuickActions from "./QuickActions";

function getGreeting(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function OverviewHeader({ name }: { name?: string }) {
    const now = new Date();
    const firstName = name?.trim().split(/\s+/)[0];

    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
                    {now.toLocaleDateString("en", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                    {getGreeting(now)}
                    {firstName ? `, ${firstName}` : ""}
                </h1>
            </div>
            <QuickActions />
        </header>
    );
}