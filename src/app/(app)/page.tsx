'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { NoteStack } from '@/components/NoteStack';
import { BlurText } from '@/components/motion/BlurText';
import { blurUp, ease, stagger } from '@/lib/motion';

const steps = [
  { title: 'Create your link', body: 'Pick a username. Your page is ready in under a minute.' },
  { title: 'Share it anywhere', body: 'Put it in your bio, a group chat, or a story.' },
  { title: 'Read honest notes', body: 'Notes arrive with no name attached. Pause them any time.' },
];

export default function Home() {
  return (
    <div className="top-glow">
      <section className="container flex flex-col items-center pt-20 pb-10 text-center sm:pt-28">
        <BlurText
          text="Hear what people won’t say to your face."
          className="max-w-3xl text-[2.6rem] leading-[1.05] tracking-[-0.035em] sm:text-6xl"
          gap={0.06}
        />
        <motion.div variants={stagger(0.08, 0.45)} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.p variants={blurUp} className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground">
            Share one link. Anyone can leave you a note, and no one, not even you, sees who wrote it.
          </motion.p>
          <motion.div variants={blurUp} className="mt-9 flex items-center gap-2">
            <Button asChild size="lg">
              <Link href="/sign-up">Get your link</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease }}
        className="container pt-6 pb-20"
      >
        <NoteStack />
      </motion.section>

      <section className="container border-t py-16">
        <motion.ol
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-10 sm:grid-cols-3"
        >
          {steps.map((step, i) => (
            <motion.li key={step.title} variants={blurUp}>
              <span className="text-sm text-muted-foreground tabular-nums">{i + 1}</span>
              <h3 className="mt-3 text-base">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </section>
    </div>
  );
}
