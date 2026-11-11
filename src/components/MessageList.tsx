'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, Search } from 'lucide-react';
import { Message } from '@/model/User';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DeleteAlert } from '@/components/DeleteAlert';
import { ease, softSpring, spring } from '@/lib/motion';

const PAGE_SIZE = 8;

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' });

function timeAgo(date: Date) {
    const seconds = Math.round((date.getTime() - Date.now()) / 1000);
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ['year', 31536000],
        ['month', 2592000],
        ['week', 604800],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
    ];
    for (const [unit, size] of units) {
        if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
    }
    return 'Just now';
}

type MessageListProps = {
    messages: Message[];
    isLoading: boolean;
    onMessageDelete: (messageId: string) => void;
    emptyState: React.ReactNode;
};

export function MessageList({ messages, isLoading, onMessageDelete, emptyState }: MessageListProps) {
    const [query, setQuery] = useState('');
    const [newestFirst, setNewestFirst] = useState(true);
    const [limit, setLimit] = useState(PAGE_SIZE);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return messages
            .filter((m) => !q || m.content.toLowerCase().includes(q))
            .sort((a, b) => {
                const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                return newestFirst ? diff : -diff;
            });
    }, [messages, query, newestFirst]);

    const shown = filtered.slice(0, limit);

    if (isLoading && messages.length === 0) {
        return (
            <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-3 rounded-2xl border bg-card p-5">
                        <Skeleton className="h-4 w-full bg-zinc-100" />
                        <Skeleton className="h-4 w-2/3 bg-zinc-100" />
                        <Skeleton className="mt-4 h-3 w-20 bg-zinc-100" />
                    </div>
                ))}
            </div>
        );
    }

    if (messages.length === 0) return <>{emptyState}</>;

    return (
        <div>
            <div className="mb-4 flex items-center gap-2">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                        type="search"
                        placeholder="Search notes"
                        aria-label="Search notes"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setLimit(PAGE_SIZE);
                        }}
                        className="h-10 pl-10 text-sm"
                    />
                </div>
                <Button
                    variant="ghost"
                    onClick={() => setNewestFirst((v) => !v)}
                    className="ml-auto"
                    aria-label={newestFirst ? 'Sorted newest first. Switch to oldest first' : 'Sorted oldest first. Switch to newest first'}
                >
                    <motion.span animate={{ rotate: newestFirst ? 0 : 180 }} transition={spring} className="flex">
                        <ArrowDown />
                    </motion.span>
                    <span className="hidden sm:inline">{newestFirst ? 'Newest' : 'Oldest'}</span>
                </Button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                {filtered.length === 0 ? (
                    <motion.p
                        key="no-results"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="py-16 text-center text-sm text-muted-foreground"
                    >
                        Nothing matches “{query}”.
                    </motion.p>
                ) : (
                    <motion.ul key="list" className="grid gap-3 md:grid-cols-2" initial={false}>
                        <AnimatePresence initial={false} mode="popLayout">
                            {shown.map((message, i) => {
                                const created = new Date(message.createdAt);
                                return (
                                    <motion.li
                                        key={String(message._id)}
                                        layout
                                        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            filter: 'blur(0px)',
                                            transition: { duration: 0.5, ease, delay: Math.min(i, 8) * 0.04 },
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.94,
                                            filter: 'blur(6px)',
                                            transition: { duration: 0.25, ease },
                                        }}
                                        transition={softSpring}
                                        whileHover={{ y: -2 }}
                                        className="group flex flex-col justify-between gap-5 rounded-2xl border bg-card p-5 shadow-[var(--shadow-hairline)] transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]"
                                    >
                                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                        <div className="flex h-7 items-center justify-between">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <time
                                                        dateTime={created.toISOString()}
                                                        tabIndex={0}
                                                        className="rounded text-xs text-muted-foreground focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-iris/15"
                                                    >
                                                        {timeAgo(created)}
                                                    </time>
                                                </TooltipTrigger>
                                                <TooltipContent>{fullDate.format(created)}</TooltipContent>
                                            </Tooltip>
                                            <div className="-mr-1.5 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                                                <DeleteAlert message={message} onMessageDelete={onMessageDelete} />
                                            </div>
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </motion.ul>
                )}
            </AnimatePresence>

            {filtered.length > limit && (
                <div className="mt-8 flex justify-center">
                    <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                        Show more
                    </Button>
                </div>
            )}
        </div>
    );
}
