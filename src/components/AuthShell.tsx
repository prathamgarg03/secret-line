'use client';

import { motion } from 'motion/react';
import { Logo } from '@/components/Logo';
import { blurUp, ease, stagger } from '@/lib/motion';

type AuthShellProps = {
    title: string;
    description: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

/** Centered auth layout: the card settles in, then title, copy and form stagger after it. */
export function AuthShell({ title, description, children, footer }: AuthShellProps) {
    return (
        <div className="top-glow flex min-h-dvh flex-col items-center px-5 pt-14 pb-16 sm:pt-24">
            <Logo />
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease }}
                className="mt-10 w-full max-w-[24rem] rounded-2xl border bg-card p-7 shadow-[var(--shadow-float)] sm:p-8"
            >
                <motion.div variants={stagger(0.06, 0.15)} initial="hidden" animate="show">
                    <motion.h1 variants={blurUp} className="text-2xl">
                        {title}
                    </motion.h1>
                    <motion.p variants={blurUp} className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </motion.p>
                    <motion.div variants={blurUp} className="mt-7">
                        {children}
                    </motion.div>
                </motion.div>
            </motion.div>
            {footer && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 text-sm text-muted-foreground"
                >
                    {footer}
                </motion.p>
            )}
        </div>
    );
}
