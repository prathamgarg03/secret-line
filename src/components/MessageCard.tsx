'use cient'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProp = {
    message: Message
    onMessageDelete: (messageId: string) => void
}

export function Alert({message, onMessageDelete}: MessageCardProp) {
    const {toast} = useToast()
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message
        })
        const messageId = message._id as string
        onMessageDelete(messageId)
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive"><X className="w-5 h-5"/></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }



function MessageCard({message, onMessageDelete}: MessageCardProp) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <Alert message={message} onMessageDelete={onMessageDelete}/>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}

export default MessageCard