'use client';

import { AnimatePresence, motion } from 'motion/react';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type UsernameStatusProps = {
    checking: boolean;
    message: string;
    available: boolean;
};

/** Live availability line under a username field. */
export function UsernameStatus({ checking, message, available }: UsernameStatusProps) {
    const key = checking ? 'checking' : message ? (available ? 'ok' : 'bad') : 'none';

    return (
        <div className="min-h-5" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
                {key !== 'none' && (
                    <motion.p
                        key={key + message}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'flex items-center gap-1.5 text-sm',
                            checking ? 'text-muted-foreground' : available ? 'text-success' : 'text-destructive'
                        )}
                    >
                        {checking ? (
                            <>
                                <Loader2 className="size-3.5 animate-spin" /> Checking availability
                            </>
                        ) : (
                            <>
                                {available ? <CircleCheck className="size-3.5" /> : <CircleX className="size-3.5" />}
                                {message}
                            </>
                        )}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
