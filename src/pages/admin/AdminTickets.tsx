import { useState } from "react";
import {
    IconAlertCircle,
    IconMessageDots,
    IconSend,
    IconTrash,
} from "@tabler/icons-react";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
    useAdminTickets,
    useDeleteAdminTicket,
    useUpdateAdminTicket,
} from "@/features/admin/useAdmin";
import type { TicketItem, TicketStatus } from "@/types/ticket";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
];

function AdminTicketRow({
    ticket,
    onDelete,
}: {
    ticket: TicketItem;
    onDelete: (ticket: TicketItem) => void;
}) {
    const update = useUpdateAdminTicket();
    const [replyText, setReplyText] = useState(ticket.adminReply ?? "");
    const [status, setStatus] = useState<TicketStatus>(ticket.status);

    const handleSave = async () => {
        await update.mutateAsync({
            id: ticket.id,
            payload: {
                status,
                adminReply: replyText,
            },
        });
    };

    return (
        <article className="rounded-xl border border-white/10 bg-white/3 p-5 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                    <Avatar
                        name={ticket.user?.name ?? "User"}
                        src={ticket.user?.profilePicture}
                        size="sm"
                    />
                    <div>
                        <p className="text-xs font-semibold text-white">
                            {ticket.user?.name ?? "Unknown User"}{" "}
                            <span className="text-[11px] font-normal text-(--color-text-muted)">
                                ({ticket.user?.email})
                            </span>
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/50">
                            <span
                                className={cn(
                                    "rounded-xs px-1.5 py-0.2 uppercase text-[9px] font-semibold tracking-wider",
                                    ticket.type === "issue"
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                        : ticket.type === "feedback"
                                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                                )}
                            >
                                {ticket.type}
                            </span>
                            <span>•</span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-[11px] text-(--color-text-muted)">Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TicketStatus)}
                        className="rounded-sm border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white focus:outline-none scheme-dark"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => onDelete(ticket)}
                        title="Delete ticket"
                        className="cursor-pointer rounded-sm p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors ml-1"
                    >
                        <IconTrash size={16} />
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-white">{ticket.subject}</h3>
                <p className="mt-1.5 text-xs text-white/80 whitespace-pre-wrap leading-relaxed">
                    {ticket.message}
                </p>
            </div>

            {/* Admin reply section */}
            <div className="rounded-sm border border-white/10 bg-white/3 p-3.5 space-y-2.5">
                <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <IconMessageDots size={14} className="text-(--color-accent)" /> Admin Response
                </label>
                <textarea
                    rows={3}
                    placeholder="Type your official reply to this athlete... (they will be notified)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-white/5 p-2.5 text-xs text-white focus:border-white/40 focus:outline-none"
                />
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={update.isPending}
                        className="flex cursor-pointer items-center gap-1.5 rounded-sm bg-(--color-accent) px-4 py-1.5 text-[10px] font-semibold tracking-wider text-black uppercase hover:opacity-90 disabled:opacity-50"
                    >
                        <IconSend size={12} />
                        {update.isPending ? "Updating..." : "Update Ticket & Send Reply"}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function AdminTickets() {
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [deletingTicket, setDeletingTicket] = useState<TicketItem | null>(null);

    const { data, isLoading, isError, refetch } = useAdminTickets({
        status: status !== "all" ? status : undefined,
        page,
        limit: 10,
    });

    const deleteTicket = useDeleteAdminTicket();

    const handleDelete = async () => {
        if (!deletingTicket) return;
        await deleteTicket.mutateAsync(deletingTicket.id);
        setDeletingTicket(null);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">Administration</p>
                    <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Support Tickets</h1>
                    <p className="mt-1 text-sm text-(--color-text-muted)">
                        Review support tickets, technical issues, and reply to athletes.
                    </p>
                </div>

                <div className="flex gap-2">
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-sm border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white focus:outline-none scheme-dark"
                    >
                        <option value="all">All Tickets</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </header>

            {isLoading ? (
                <div className="space-y-3">
                    <div className="h-32 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                    <div className="h-32 animate-pulse rounded-sm border border-white/10 bg-white/2" />
                </div>
            ) : isError ? (
                <div className="flex items-center justify-between rounded-sm border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
                    <div className="flex items-center gap-2">
                        <IconAlertCircle size={18} />
                        <span>Failed to load support tickets.</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="underline underline-offset-4 hover:text-white"
                    >
                        Retry
                    </button>
                </div>
            ) : data?.tickets.length === 0 ? (
                <div className="rounded-sm border border-dashed border-white/10 p-12 text-center text-xs text-(--color-text-muted)">
                    No support tickets found.
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.tickets.map((ticket) => (
                        <AdminTicketRow
                            key={ticket.id}
                            ticket={ticket}
                            onDelete={(t) => setDeletingTicket(t)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {data && data.pages > 1 && (
                <div className="flex items-center justify-between text-xs text-(--color-text-muted)">
                    <span>
                        Page {data.page} of {data.pages} ({data.total} total tickets)
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="cursor-pointer rounded-sm border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={page >= data.pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="cursor-pointer rounded-sm border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!deletingTicket}
                title="Delete Support Ticket?"
                message={`Are you sure you want to permanently delete ticket "${deletingTicket?.subject}"? This action cannot be undone.`}
                isPending={deleteTicket.isPending}
                onConfirm={handleDelete}
                onCancel={() => setDeletingTicket(null)}
            />
        </div>
    );
}
