import { useState } from "react";
import {
    IconBarbell,
    IconCalendar,
    IconDownload,
    IconFileTypeCsv,
    IconFileTypePdf,
    IconToolsKitchen2,
    IconTrendingUp,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
    downloadReportFile,
    type ReportFormat,
    type ReportType,
} from "@/services/reportService";
import { cn } from "@/lib/utils";

const REPORT_TYPES: {
    id: ReportType;
    title: string;
    description: string;
    icon: typeof IconBarbell;
}[] = [
    {
        id: "workouts",
        title: "Workouts Report",
        description: "Logged sessions, routine exercises, completed sets, reps, and lifted weights.",
        icon: IconBarbell,
    },
    {
        id: "nutrition",
        title: "Nutrition Report",
        description: "Daily meal logs, food items, caloric intake, and macronutrient breakdowns.",
        icon: IconToolsKitchen2,
    },
    {
        id: "progress",
        title: "Progress Report",
        description: "Body weight check-ins, body circumference measurements, and strength PRs.",
        icon: IconTrendingUp,
    },
];

export default function Reports() {
    const [selectedType, setSelectedType] = useState<ReportType>("workouts");
    const [format, setFormat] = useState<ReportFormat>("pdf");

    const today = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    const [from, setFrom] = useState(thirtyDaysAgo);
    const [to, setTo] = useState(today);
    const [isDownloading, setIsDownloading] = useState(false);

    const setPreset = (days: number | null) => {
        setTo(today);
        if (days === null) {
            setFrom("");
        } else {
            const d = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
            setFrom(d);
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadReportFile(selectedType, format, from || undefined, to || undefined);
            toast.success(`${selectedType.toUpperCase()} report downloaded successfully.`);
        } catch {
            toast.error("Failed to generate report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <header>
                <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Export</p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Reports & Data</h1>
                <p className="mt-1 text-sm text-(--color-text-muted)">
                    Generate and download formatted PDF documents or raw CSV spreadsheets of your fitness history.
                </p>
            </header>

            {/* Type selection */}
            <section aria-label="Select report type" className="space-y-3">
                <h2 className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                    1. Select Data Type
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                    {REPORT_TYPES.map((t) => {
                        const Icon = t.icon;
                        const isSelected = selectedType === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setSelectedType(t.id)}
                                className={cn(
                                    "flex flex-col text-left cursor-pointer rounded-sm border p-4 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                                    isSelected
                                        ? "border-(--color-accent) bg-white/5 shadow-[0_0_15px_rgba(255,165,0,0.1)]"
                                        : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4",
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <Icon
                                        size={22}
                                        className={isSelected ? "text-(--color-accent)" : "text-white/60"}
                                    />
                                    {isSelected && (
                                        <span className="size-2 rounded-full bg-(--color-accent)" />
                                    )}
                                </div>
                                <h3 className="mt-3 text-sm font-semibold text-white">{t.title}</h3>
                                <p className="mt-1 text-xs text-(--color-text-muted) leading-relaxed">
                                    {t.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Format selection */}
            <section aria-label="Select format" className="space-y-3">
                <h2 className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                    2. Select Export Format
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => setFormat("pdf")}
                        className={cn(
                            "flex items-center gap-3.5 cursor-pointer rounded-sm border p-4 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                            format === "pdf"
                                ? "border-(--color-accent) bg-white/5"
                                : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4",
                        )}
                    >
                        <IconFileTypePdf
                            size={28}
                            className={format === "pdf" ? "text-(--color-accent)" : "text-white/60"}
                        />
                        <div className="text-left">
                            <p className="text-sm font-semibold text-white">PDF Document (.pdf)</p>
                            <p className="text-xs text-(--color-text-muted)">
                                Clean tabular layout with branding, summary statistics and page breaks.
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setFormat("csv")}
                        className={cn(
                            "flex items-center gap-3.5 cursor-pointer rounded-sm border p-4 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                            format === "csv"
                                ? "border-(--color-accent) bg-white/5"
                                : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4",
                        )}
                    >
                        <IconFileTypeCsv
                            size={28}
                            className={format === "csv" ? "text-emerald-400" : "text-white/60"}
                        />
                        <div className="text-left">
                            <p className="text-sm font-semibold text-white">CSV Spreadsheet (.csv)</p>
                            <p className="text-xs text-(--color-text-muted)">
                                Raw tabular format ready for import into Excel, Google Sheets or analytics tools.
                            </p>
                        </div>
                    </button>
                </div>
            </section>

            {/* Date range picker */}
            <section
                aria-label="Select date range"
                className="rounded-sm border border-white/10 bg-white/2 p-5 space-y-4"
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                        3. Date Range
                    </h2>
                    <div className="flex gap-2 text-xs">
                        <button
                            type="button"
                            onClick={() => setPreset(7)}
                            className="cursor-pointer rounded-sm bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                        >
                            Last 7 days
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreset(30)}
                            className="cursor-pointer rounded-sm bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                        >
                            Last 30 days
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreset(90)}
                            className="cursor-pointer rounded-sm bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                        >
                            Last 90 days
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreset(null)}
                            className="cursor-pointer rounded-sm bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                        >
                            All Time
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="block text-[11px] text-(--color-text-muted) mb-1.5 flex items-center gap-1.5">
                            <IconCalendar size={14} /> From date
                        </label>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none scheme-dark"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] text-(--color-text-muted) mb-1.5 flex items-center gap-1.5">
                            <IconCalendar size={14} /> To date
                        </label>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-white/40 focus:outline-none scheme-dark"
                        />
                    </div>
                </div>
            </section>

            {/* Action button */}
            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-(--color-accent) px-6 py-3 text-xs font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    <IconDownload size={16} stroke={2} />
                    {isDownloading ? "Generating Report..." : `Download ${selectedType} ${format.toUpperCase()}`}
                </button>
            </div>
        </div>
    );
}
