'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useCompletion } from '@ai-sdk/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/Logo';
import { SubmitButton } from '@/components/SubmitButton';
import { BlurText } from '@/components/motion/BlurText';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { blurUp, ease, softSpring, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

const MAX_LENGTH = 300;

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const prompt =
  "Create a list of three unique, open-ended, and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal, sensitive, or controversial topics, and focus instead on universal themes that encourage friendly and inclusive interaction. Consider topics such as hobbies, experiences, aspirations, and simple joys. The questions should inspire curiosity, foster meaningful conversations, and contribute to a positive and welcoming environment. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Be creative and thoughtful to ensure the questions are intriguing and engaging for people from all walks of life.";

function SentConfirmation({ username, onReset }: { username: string; onReset: () => void }) {
  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="flex flex-col items-center px-6 py-14 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 }}
        className="flex size-12 items-center justify-center rounded-full bg-iris-soft"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            className="stroke-iris"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.25, ease }}
          />
        </svg>
      </motion.div>
      <motion.div variants={stagger(0.07, 0.35)} initial="hidden" animate="show">
        <motion.h2 variants={blurUp} className="mt-5 text-xl">
          Sent
        </motion.h2>
        <motion.p variants={blurUp} className="mt-1.5 text-sm text-muted-foreground">
          @{username} will find your note in their inbox.
        </motion.p>
        <motion.div variants={blurUp}>
          <Button variant="outline" className="mt-7" onClick={onReset}>
            Write another
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const SendMessage = () => {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });
  const content = form.watch('content') ?? '';

  const {
    completion,
    complete,
    isLoading: isSuggestionLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-message',
    initialCompletion: initialMessageString,
    streamProtocol: 'text',
  });

  const suggestions = completion
    .split('||')
    .map((s) => s.trim())
    .filter(Boolean);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      await axios.post('/api/send-message', { ...data, username });
      form.reset({ content: '' });
      setSent(true);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Your note didn’t send. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestMessages = async () => {
    try {
      await complete(prompt);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  return (
    <div className="top-glow flex min-h-dvh flex-col">
      <header className="container flex h-16 items-center">
        <Logo />
      </header>

      <main className="container max-w-xl flex-1 pt-14 pb-20 sm:pt-20">
        <BlurText text={`Leave @${username} a note`} className="text-3xl sm:text-4xl" />
        <motion.div variants={stagger(0.08, 0.3)} initial="hidden" animate="show">
          <motion.p variants={blurUp} className="mt-2 text-muted-foreground">
            They’ll read it. They’ll never know it was you.
          </motion.p>

          <motion.div
            variants={blurUp}
            layout
            transition={softSpring}
            className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-float)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <SentConfirmation username={username} onReset={() => setSent(false)} />
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, scale: 0.98, filter: 'blur(6px)', transition: { duration: 0.3, ease } }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="sr-only">Your note</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write something kind, honest, or curious…"
                                className="min-h-40 resize-none rounded-none border-0 bg-transparent px-5 pt-5 text-base leading-relaxed shadow-none hover:border-0 focus-visible:ring-0"
                                maxLength={MAX_LENGTH}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="px-5 pb-2" />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between gap-4 px-5 pb-5">
                        <span
                          className={cn(
                            'text-xs tabular-nums transition-colors duration-300',
                            content.length > MAX_LENGTH - 30 ? 'text-destructive' : 'text-zinc-400'
                          )}
                        >
                          {content.length} / {MAX_LENGTH}
                        </span>
                        <SubmitButton pending={isLoading} pendingLabel="Sending" disabled={!content.trim()}>
                          Send note
                        </SubmitButton>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {!sent && (
              <motion.section
                key="ideas"
                variants={blurUp}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                aria-labelledby="ideas-heading"
                className="mt-12"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 id="ideas-heading" className="text-sm text-muted-foreground">
                    Not sure what to say? Tap an idea.
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={suggestMessages}
                    disabled={isSuggestionLoading}
                    className="-mr-2"
                  >
                    <motion.span
                      animate={isSuggestionLoading ? { rotate: 360 } : { rotate: 0 }}
                      transition={isSuggestionLoading ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : { duration: 0 }}
                      className="flex"
                    >
                      <RotateCw className="!size-3.5" />
                    </motion.span>
                    New ideas
                  </Button>
                </div>

                <div className="mt-3">
                  {error ? (
                    <p className="py-4 text-sm text-destructive">Ideas didn’t load. Try “New ideas” again.</p>
                  ) : isSuggestionLoading && suggestions.length === 0 ? (
                    <div className="flex flex-col gap-2">
                      {[100, 80, 65].map((w) => (
                        <Skeleton key={w} className="h-11 rounded-xl bg-zinc-100" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  ) : (
                    <ul className="flex flex-col items-start gap-2">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {suggestions.map((suggestion, index) => (
                          <motion.li
                            key={suggestion}
                            layout
                            initial={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)', transition: { delay: index * 0.07, duration: 0.4, ease } }}
                            exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.15 } }}
                            className="max-w-full"
                          >
                            <motion.button
                              type="button"
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              transition={softSpring}
                              onClick={() => form.setValue('content', suggestion, { shouldValidate: true })}
                              className="rounded-xl rounded-tl-md border bg-card px-4 py-2.5 text-left text-sm shadow-[var(--shadow-hairline)] transition-colors hover:border-zinc-300 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-iris/15"
                            >
                              {suggestion}
                            </motion.button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <footer className="container flex items-center justify-center gap-1.5 py-8 text-[13px] text-muted-foreground">
        Want notes of your own?
        <Link href="/sign-up" className="text-foreground underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-foreground">
          Get your link
        </Link>
      </footer>
    </div>
  );
};

export default SendMessage;
