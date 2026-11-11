'use client';

import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import type { User } from 'next-auth';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { Check, Copy, RotateCw, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageList } from '@/components/MessageList';
import { AnimatedNumber } from '@/components/motion/AnimatedNumber';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { blurUp, ease, spring, stagger } from '@/lib/motion';

function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Couldn’t copy. Select the link and copy it manually.');
    }
  };

  return (
    <Button onClick={copy} disabled={!value} className={className} aria-live="polite">
      <span className="relative flex size-4">
        <AnimatePresence initial={false}>
          <motion.span
            key={copied ? 'check' : 'copy'}
            initial={{ opacity: 0, scale: 0.4, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.4, filter: 'blur(4px)' }}
            transition={spring}
            className="absolute inset-0 flex"
          >
            {copied ? <Check /> : <Copy />}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.span layout="position" transition={spring}>
        {copied ? 'Copied' : 'Copy link'}
      </motion.span>
    </Button>
  );
}

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptMessage, setAcceptMessage] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);

  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  // The session only resolves on the client, so window is always available here.
  const profileUrl = user ? `${window.location.origin}/u/${user.username}` : '';
  const displayUrl = profileUrl.replace(/^https?:\/\//, '');

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message');
      setAcceptMessage(response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Couldn’t load your note settings.');
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (refresh = false) => {
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) toast.success('Inbox is up to date');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Couldn’t load your notes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    // Defer to a microtask so the fetches start after this effect commits.
    queueMicrotask(() => {
      fetchMessages();
      fetchAcceptMessage();
    });
  }, [user, fetchMessages, fetchAcceptMessage]);

  const refreshMessages = () => {
    setIsLoading(true);
    fetchMessages(true);
  };

  const handleSwitchChange = async (next: boolean) => {
    setAcceptMessage(next); // optimistic
    setIsSwitchLoading(true);
    try {
      await axios.post<ApiResponse>('/api/accept-message', { acceptMessage: next });
    } catch (error) {
      setAcceptMessage(!next);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Couldn’t update your note settings.');
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((message) => String(message._id) !== messageId));
  };

  const shareLink = async () => {
    try {
      await navigator.share({ title: 'Send me an anonymous note', url: profileUrl });
    } catch {
      /* share sheet dismissed */
    }
  };

  if (!user) {
    return (
      <div className="container max-w-4xl space-y-6 pt-14">
        <Skeleton className="h-9 w-40 bg-zinc-100" />
        <Skeleton className="h-36 w-full rounded-2xl bg-zinc-100" />
      </div>
    );
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      animate="show"
      className="container max-w-4xl pt-12 pb-16 sm:pt-16"
    >
      <motion.header variants={blurUp}>
        <h1 className="text-3xl sm:text-4xl">Inbox</h1>
        <p className="mt-1.5 text-muted-foreground">@{user.username}</p>
      </motion.header>

      {/* Link + availability */}
      <motion.section
        variants={blurUp}
        aria-label="Your link"
        className="mt-10 rounded-2xl border bg-card shadow-[var(--shadow-soft)]"
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Your link</p>
            <p className="mt-1 truncate text-[17px] font-medium tracking-tight select-all">{displayUrl}</p>
          </div>
          <div className="flex gap-2">
            <CopyButton value={profileUrl} className="flex-1 sm:flex-none" />
            {canShare && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="size-10" onClick={shareLink} aria-label="Share link">
                    <Share />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t px-5 py-4 sm:px-6">
          <span className="relative flex size-2">
            <AnimatePresence>
              {acceptMessage && (
                <motion.span
                  key="ping"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 0], scale: [1, 2.4] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-iris"
                />
              )}
            </AnimatePresence>
            <motion.span
              animate={{ backgroundColor: acceptMessage ? 'var(--iris)' : '#d4d4d8' }}
              transition={{ duration: 0.3 }}
              className="relative size-2 rounded-full"
            />
          </span>
          <div className="min-w-0 flex-1">
            <Label htmlFor="accept-messages" className="cursor-pointer text-sm font-medium">
              Accept new notes
            </Label>
            <div className="relative h-5 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={acceptMessage ? 'on' : 'off'}
                  initial={{ y: 12, opacity: 0, filter: 'blur(3px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -12, opacity: 0, filter: 'blur(3px)' }}
                  transition={{ duration: 0.3, ease }}
                  className="text-[13px] text-muted-foreground"
                >
                  {acceptMessage ? 'Anyone with your link can write to you.' : 'Paused. Your link won’t take new notes.'}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <Switch
            id="accept-messages"
            checked={acceptMessage}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
        </div>
      </motion.section>

      {/* Notes */}
      <motion.section variants={blurUp} aria-labelledby="notes-heading" className="mt-14">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 id="notes-heading" className="flex items-baseline gap-2.5 text-xl">
            Notes
            <AnimatedNumber value={messages.length} className="text-base text-muted-foreground tabular-nums" />
          </h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={refreshMessages} disabled={isLoading} aria-label="Refresh notes">
                <motion.span
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={isLoading ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : { duration: 0 }}
                  className="flex"
                >
                  <RotateCw />
                </motion.span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </div>

        <MessageList
          messages={messages}
          isLoading={isLoading}
          onMessageDelete={handleDeleteMessage}
          emptyState={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex gap-1 rounded-2xl rounded-tl-md border bg-card px-4 py-3 shadow-[var(--shadow-soft)]"
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 rounded-full bg-zinc-300" />
                ))}
              </motion.div>
              <h3 className="mt-6 text-base">No notes yet</h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Share your link and the first one will show up here.
              </p>
              <CopyButton value={profileUrl} className="mt-6" />
            </motion.div>
          }
        />
      </motion.section>
    </motion.div>
  );
}

export default Dashboard;
