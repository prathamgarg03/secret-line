'use client';

import { motion } from 'motion/react';
import { ease } from '@/lib/motion';

/** Soft fade + lift on every route change (used from template.tsx files). */
export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, ease }}
        >
            {children}
        </motion.div>
    );
}
