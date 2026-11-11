import type { Transition, Variants } from 'motion/react';

/** Shared motion language: one easing curve, two springs. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const spring: Transition = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 };
export const softSpring: Transition = { type: 'spring', stiffness: 220, damping: 28 };

/** Parent that staggers its children in. */
export const stagger = (gap = 0.06, delay = 0): Variants => ({
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Child: rises a few pixels out of a soft blur. */
export const blurUp: Variants = {
    hidden: { opacity: 0, y: 8, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
};
