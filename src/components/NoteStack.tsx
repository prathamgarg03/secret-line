'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import notes from '@/messages.json';
import { softSpring } from '@/lib/motion';

const VISIBLE = 4;
/** Times are by position so the stack always reads newest-first. */
const AGES = ['Just now', '3 min ago', '18 min ago', '1 hr ago'];
const READ_MS = 2600;
const TYPING_MS = 1500;

function TypingBubble() {
    return (
        <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md border bg-card px-4 py-3.5 shadow-[var(--shadow-hairline)]">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-zinc-400"
                    animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}

/**
 * Hero visual: someone is typing… then their note lands at the top of the
 * inbox and nudges the older ones down.
 */
export function NoteStack() {
    const [cursor, setCursor] = useState(0);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        const t = setTimeout(
            () => {
                if (typing) setCursor((c) => c + 1);
                setTyping((v) => !v);
            },
            typing ? TYPING_MS : READ_MS
        );
        return () => clearTimeout(t);
    }, [typing]);

    const visible = Array.from({ length: VISIBLE }, (_, i) => {
        const index = cursor - i;
        const n = ((index % notes.length) + notes.length) % notes.length;
        return { key: index, ...notes[n] };
    });

    return (
        <div aria-hidden className="relative mx-auto w-full max-w-md">
            <ul className="flex h-[23rem] flex-col items-start gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
                <AnimatePresence initial={false} mode="popLayout">
                    {typing && (
                        <motion.li
                            key="typing"
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)', transition: { duration: 0.15 } }}
                            transition={softSpring}
                            style={{ originX: 0, originY: 0 }}
                        >
                            <TypingBubble />
                        </motion.li>
                    )}
                    {visible.map((note, i) => (
                        <motion.li
                            key={note.key}
                            layout
                            initial={{ opacity: 0, y: -4, scale: 0.97, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                            transition={softSpring}
                            style={{ originX: 0, originY: 0 }}
                            className="w-full rounded-2xl rounded-tl-md border bg-card px-5 py-4 shadow-[var(--shadow-soft)]"
                        >
                            <p className="text-[15px] leading-relaxed">{note.content}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {AGES[i]}
                            </p>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
}
