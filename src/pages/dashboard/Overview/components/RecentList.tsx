import type { ReactNode } from "react";
import { IconBell, type Icon } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ChartCard from "@/components/dashboard/ChartCard";


type RecentListItemProps = {
    icon: Icon;
    title: string;
    
    subtitle?: string;
    
    value?: string;
    
    meta?: string;
};

export function RecentListItem({
    icon: IconComponent = IconBell,
    title,
    subtitle,
    value,
    meta,
}: RecentListItemProps) {
    return (
        <div className="flex items-center gap-3 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-white/5 text-white/60">
                <IconComponent size={18} stroke={1.5} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{title}</p>
                {subtitle && (
                    <p className="truncate text-xs text-(--color-text-muted)">{subtitle}</p>
                )}
            </div>

            {(value || meta) && (
                <div className="shrink-0 text-right">
                    {value && (
                        <p className="text-sm font-semibold text-white tabular-nums">{value}</p>
                    )}
                    {meta && <p className="text-xs text-(--color-text-muted)">{meta}</p>}
                </div>
            )}
        </div>
    );
}





type RecentListProps<T> = {
    title: string;
    description?: string;
    
    viewAllTo?: string;
    items?: T[];
    getKey: (item: T) => string;
    renderItem: (item: T) => ReactNode;

    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
    emptyTitle?: string;
    emptyMessage?: string;
    
    skeletonRows?: number;
    className?: string;
};

function ListSkeleton({ rows }: { rows: number }) {
    return (
        <div aria-hidden="true" className="animate-pulse divide-y divide-white/10">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                    <div className="size-9 shrink-0 rounded-sm bg-white/10" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-white/10" />
                        <div className="h-2.5 w-20 rounded bg-white/10" />
                    </div>
                    <div className="h-3 w-12 rounded bg-white/10" />
                </div>
            ))}
        </div>
    );
}

export default function RecentList<T>({
    title,
    description,
    viewAllTo,
    items,
    getKey,
    renderItem,
    isLoading = false,
    isError = false,
    onRetry,
    emptyTitle = "Nothing here yet",
    emptyMessage,
    skeletonRows = 4,
    className,
}: RecentListProps<T>) {
    return (
        <ChartCard
            title={title}
            description={description}
            action={
                viewAllTo && (
                    <Link
                        to={viewAllTo}
                        className="text-[10px] tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    >
                        View all
                    </Link>
                )
            }
            
            
            isError={isError}
            onRetry={onRetry}
            isEmpty={!isLoading && !!items && items.length === 0}
            emptyTitle={emptyTitle}
            emptyMessage={emptyMessage}
            className={className}
        >
            {isLoading || !items ? (
                <ListSkeleton rows={skeletonRows} />
            ) : (
                <ul className="divide-y divide-white/10">
                    {items.map((item) => (
                        <li key={getKey(item)}>{renderItem(item)}</li>
                    ))}
                </ul>
            )}
        </ChartCard>
    );
}