'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';

type SubmitButtonProps = ButtonProps & {
    pending: boolean;
    pendingLabel: string;
};

/** Submit button whose label cross-fades to a spinner while the request runs. */
export function SubmitButton({ pending, pendingLabel, children, disabled, ...props }: SubmitButtonProps) {
    return (
        <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={pending ? 'pending' : 'idle'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-2"
                >
                    {pending ? (
                        <>
                            <Loader2 className="animate-spin" />
                            {pendingLabel}
                        </>
                    ) : (
                        children
                    )}
                </motion.span>
            </AnimatePresence>
        </Button>
    );
}
