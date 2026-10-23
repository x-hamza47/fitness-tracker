import { useState } from "react";
import {
    IconCheck,
    IconClock,
    IconHelpCircle,
    IconLifebuoy,
    IconMessageDots,
    IconSend,
} from "@tabler/icons-react";
import { useCreateTicket, useMyTickets } from "@/features/support/useTickets";
import type { TicketStatus, TicketType } from "@/types/ticket";
import { cn } from "@/lib/utils";

const TICKET_TYPES: { id: TicketType; label: string; description: string }[] = [
    {
        id: "contact",
        label: "General Support",
        description: "Need help using Forge or account assistance.",
    },
    {
        id: "issue",
        label: "Report an Issue",
        description: "Encountered a bug, calculation error or glitch.",
    },
    {
        id: "feedback",
        label: "Feedback & Suggestions",
        description: "Ideas to improve our workouts, nutrition, or metrics.",
    },
];

const STATUS_CONFIG: Record<
    TicketStatus,
    { label: string; icon: typeof IconClock; color: string }
> = {
    open: {
        label: "Open",
        icon: IconClock,
        color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    in_progress: {
        label: "In Progress",
        icon: IconHelpCircle,
        color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    resolved: {
        label: "Resolved",
        icon: IconCheck,
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
};

export default function Support() {
    const [tab, setTab] = useState<"form" | "tickets">("form");
    const { tickets, isLoading } = useMyTickets();
    const create = useCreateTicket();

    const [type, setType] = useState<TicketType>("contact");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        await create.mutateAsync({
            type,
            subject: subject.trim(),
            message: message.trim(),
        });

        setSubject("");
        setMessage("");
        setTab("tickets");
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Helpdesk</p>
                    <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Support & Feedback</h1>
                    <p className="mt-1 text-sm text-(--color-text-muted)">
                        Contact the Forge team for technical support, bug reports, and product feedback.
                    </p>
                </div>

                <div className="flex rounded-sm border border-white/10 bg-white/5 p-1 text-xs">
                    <button
                        type="button"
                        onClick={() => setTab("form")}
                        className={cn(
                            "cursor-pointer rounded-xs px-3 py-1.5 font-semibold transition-colors uppercase text-[10px] tracking-[0.1em]",
                            tab === "form" ? "bg-(--color-accent) text-black" : "text-white/60 hover:text-white",
                        )}
                    >
                        New Ticket
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("tickets")}
                        className={cn(
                            "cursor-pointer rounded-xs px-3 py-1.5 font-semibold transition-colors uppercase text-[10px] tracking-[0.1em] flex items-center gap-1.5",
                            tab === "tickets" ? "bg-(--color-accent) text-black" : "text-white/60 hover:text-white",
                        )}
                    >
                        My Tickets
                        {tickets.length > 0 && (
                            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] text-white">
                                {tickets.length}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {tab === "form" ? (
                <div className="rounded-sm border border-white/10 bg-white/2 p-6 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold tracking-wider text-white uppercase mb-2">
                                1. Ticket Category
                            </label>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {TICKET_TYPES.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setType(t.id)}
                                        className={cn(
                                            "cursor-pointer rounded-sm border p-3.5 text-left transition-all",
                                            type === t.id
                                                ? "border-(--color-accent) bg-white/5 text-white"
                                                : "border-white/10 bg-white/2 text-white/60 hover:border-white/20 hover:text-white",
                                        )}
                                    >
                                        <p className="text-xs font-semibold">{t.label}</p>
                                        <p className="mt-1 text-[11px] text-(--color-text-muted) leading-relaxed">
                                            {t.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold tracking-wider text-white uppercase mb-2">
                                2. Subject
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={120}
                                placeholder="Summary of your question or issue"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full rounded-sm border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-white/40 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold tracking-wider text-white uppercase mb-2">
                                3. Detailed Message
                            </label>
                            <textarea
                                required
                                rows={6}
                                maxLength={2000}
                                placeholder="Please describe what happened, steps to reproduce, or suggestions..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full rounded-sm border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-white/40 focus:outline-none"
                            />
                            <p className="mt-1 text-right text-[10px] text-white/40">
                                {message.length} / 2000 characters
                            </p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={create.isPending || !subject.trim() || !message.trim()}
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-(--color-accent) px-6 py-2.5 text-xs font-semibold tracking-[0.15em] text-black uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
                            >
                                <IconSend size={15} />
                                {create.isPending ? "Submitting..." : "Submit Ticket"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="space-y-3">
                            <div className="h-24 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                            <div className="h-24 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="rounded-sm border border-dashed border-white/15 p-12 text-center">
                            <IconLifebuoy size={36} className="mx-auto text-white/30" />
                            <h2 className="mt-3 text-sm font-semibold text-white uppercase tracking-wider">
                                No Tickets Yet
                            </h2>
                            <p className="mt-1 text-xs text-(--color-text-muted)">
                                If you need assistance or encounter any problems, submit a ticket above.
                            </p>
                            <button
                                type="button"
                                onClick={() => setTab("form")}
                                className="mt-4 cursor-pointer rounded-sm bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
                            >
                                Submit a Ticket
                            </button>
                        </div>
                    ) : (
                        tickets.map((t) => {
                            const statusInfo = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.open;
                            const StatusIcon = statusInfo.icon;

                            return (
                                <article
                                    key={t.id}
                                    className="rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm space-y-3"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className={cn(
                                                    "flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase",
                                                    statusInfo.color,
                                                )}
                                            >
                                                <StatusIcon size={12} />
                                                {statusInfo.label}
                                            </span>
                                            <span className="rounded-sm bg-white/5 px-2 py-0.5 text-[10px] tracking-wider text-white/60 uppercase">
                                                {t.type}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-(--color-text-muted)">
                                            {new Date(t.createdAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-white">{t.subject}</h3>
                                        <p className="mt-2 text-xs text-white/80 leading-relaxed whitespace-pre-wrap">
                                            {t.message}
                                        </p>
                                    </div>

                                    {t.adminReply && (
                                        <div className="mt-4 rounded-sm border border-(--color-accent)/30 bg-(--color-accent)/5 p-3.5">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-(--color-accent)">
                                                <IconMessageDots size={16} />
                                                <span>Staff Response</span>
                                            </div>
                                            <p className="mt-1.5 text-xs text-white/90 leading-relaxed whitespace-pre-wrap">
                                                {t.adminReply}
                                            </p>
                                        </div>
                                    )}
                                </article>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
