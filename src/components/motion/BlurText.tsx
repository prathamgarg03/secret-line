'use client';

import { motion } from 'motion/react';
import { ease } from '@/lib/motion';

type BlurTextProps = {
    text: string;
    as?: 'h1' | 'h2' | 'p';
    className?: string;
    delay?: number;
    /** Seconds between words. */
    gap?: number;
};

/** Reveals text word by word, each word sharpening out of a blur. */
export function BlurText({ text, as = 'h1', className, delay = 0, gap = 0.05 }: BlurTextProps) {
    const Tag = motion[as];
    const words = text.split(' ');

    return (
        <Tag
            className={className}
            aria-label={text}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: gap, delayChildren: delay }}
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    aria-hidden
                    className="inline-block whitespace-pre"
                    variants={{
                        hidden: { opacity: 0, y: '0.3em', filter: 'blur(8px)' },
                        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
                    }}
                >
                    {word}
                    {i < words.length - 1 ? ' ' : ''}
                </motion.span>
            ))}
        </Tag>
    );
}
