'use client';

import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

/** A number that counts smoothly to its new value. */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
    const spring = useSpring(value, { stiffness: 140, damping: 22 });
    const display = useTransform(spring, (v) => Math.round(v).toString());

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span className={className}>{display}</motion.span>;
}
