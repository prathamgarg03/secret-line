'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SubmitButton } from '@/components/SubmitButton';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';

type DeleteAlertProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function DeleteAlert({ message, onMessageDelete }: DeleteAlertProp) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMessage = async () => {
    setIsDeleting(true);
    try {
      await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      setOpen(false);
      toast.success('Note deleted');
      // Let the dialog close before the card animates out.
      setTimeout(() => onMessageDelete(String(message._id)), 180);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Couldn’t delete this note. Try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Delete note" className="size-7 rounded-md hover:text-destructive">
              <Trash2 className="!size-3.5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>It will be removed from your inbox for good.</p>
              <blockquote className="line-clamp-3 rounded-xl border bg-zinc-50 px-4 py-3 text-[15px] leading-relaxed text-foreground">
                {message.content}
              </blockquote>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isDeleting}>Keep it</AlertDialogCancel>
          <SubmitButton type="button" variant="destructive" pending={isDeleting} pendingLabel="Deleting" onClick={deleteMessage}>
            Delete note
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
