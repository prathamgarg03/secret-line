import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Mark: a speech bubble whose contents are hidden behind a single line. */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className={cn('size-6', className)} fill="none">
            <path
                d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6a3.5 3.5 0 0 1-3.5 3.5H11l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A3.5 3.5 0 0 1 4 12.5v-6Z"
                className="fill-foreground"
            />
            <path d="M8.5 9.5h7" strokeWidth="1.8" strokeLinecap="round" className="stroke-background" />
        </svg>
    );
}

export function Logo({ href = '/', className }: { href?: string; className?: string }) {
    return (
        <Link
            href={href}
            className={cn(
                'inline-flex items-center gap-2 rounded-md text-[15px] font-medium tracking-tight focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-iris/15',
                className
            )}
        >
            <LogoMark />
            Secret Line
        </Link>
    );
}
