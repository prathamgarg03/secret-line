'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { MoreHorizontal, Trash2} from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type DeleteAlertProp = {
  message?: Message
  messages?: Message[]
  onMessageDelete: (messageId: string) => void
}

export function Alert({ message, messages, onMessageDelete }: DeleteAlertProp) {

  const { toast } = useToast()
  const deleteMessage = async () => {
    try {
      if (message) {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
          title: response.data.message
        })
        const messageId = message._id as string
        onMessageDelete(messageId)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  }

  const deleteMessages = async () => {
    try {
      if (messages) {
        const messageIds = messages.map(message => message._id)
        
        const response = await axios.delete<ApiResponse>('/api/delete-messages', {
          data: {messageIds: messageIds}
        })
        toast({
          title: response.data.message
        })

        for(const messageId of messageIds) {
          console.log('delete: ', messageId)
          onMessageDelete(messageId as string)
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="p-0 w-full">
           Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the message from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {message &&
            <AlertDialogAction onClick={deleteMessage}>Continue</AlertDialogAction>
          }
          {
            messages &&
            <AlertDialogAction onClick={deleteMessages}>Continue</AlertDialogAction>
          }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

