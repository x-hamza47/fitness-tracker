import { useId, type ReactNode } from "react";
import { IconAlertTriangle, IconInbox } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type ChartCardProps = {
    title: string;
    description?: string;
    action?: ReactNode;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
    isEmpty?: boolean;
    emptyTitle?: string;
    emptyMessage?: string;
    isRefetching?: boolean;
    contentClassName?: string;
    className?: string;
    children: ReactNode;
};

function CardMessage({
    icon: IconComponent,
    title,
    message,
    action,
}: {
    icon: typeof IconInbox;
    title: string;
    message?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 px-4 py-6 text-center">
            <IconComponent size={28} stroke={1.25} className="text-white/30" aria-hidden="true" />
            <p className="text-sm font-semibold text-white">{title}</p>
            {message && <p className="max-w-xs text-xs text-(--color-text-muted)">{message}</p>}
            {action}
        </div>
    );
}

export default function ChartCard({
    title,
    description,
    action,
    isLoading = false,
    isError = false,
    onRetry,
    isEmpty = false,
    emptyTitle = "Nothing here yet",
    emptyMessage,
    isRefetching = false,
    contentClassName,
    className,
    children,
}: ChartCardProps) {
    const titleId = useId();
    
    let body: ReactNode;
    if (isLoading) {
        body = <div aria-hidden="true" className="size-full animate-pulse rounded-sm bg-white/5 backdrop-blur-xs" />;
    } else if (isError) {
        body = (
            <CardMessage
                icon={IconAlertTriangle}
                title="Couldn't load this section"
                message="Something went wrong while fetching your data."
                action={
                    onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-1 cursor-pointer rounded-sm border border-white/20 px-3 py-1.5 text-[10px] tracking-[0.15em] text-white uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            Try again
                        </button>
                    )
                }
            />
        );
    } else if (isEmpty) {
        body = <CardMessage icon={IconInbox} title={emptyTitle} message={emptyMessage} />;
    } else {
        body = children;
    }

    return (
        <section
            aria-labelledby={titleId}
            aria-busy={isLoading || isRefetching}
            className={cn("flex flex-col rounded-sm border border-white/10 bg-white/2 p-5 backdrop-blur-sm", className)}
        >
            <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 id={titleId} className="text-xs font-semibold tracking-[0.2em] text-white uppercase">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-1 text-xs text-(--color-text-muted)">{description}</p>
                    )}
                </div>
                {action}
            </header>

            <div
                className={cn(
                    "mt-5 min-w-0 flex-1 transition-opacity duration-200",
                    isRefetching && "opacity-50",
                    contentClassName,
                )}
            >
                {body}
            </div>
        </section>
    );
}