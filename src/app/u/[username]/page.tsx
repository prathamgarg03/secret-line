'use client'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useCompletion } from 'ai/react';
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SendMessage = () => {
  const params = useParams<{ username: string }>()
  const username = params.username

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const formContent = form.watch('content')


  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-message', {
        ...data,
        username
      })
      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const prompt = "Create a list of three unique, open-ended, and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal, sensitive, or controversial topics, and focus instead on universal themes that encourage friendly and inclusive interaction. Consider topics such as hobbies, experiences, aspirations, and simple joys. The questions should inspire curiosity, foster meaningful conversations, and contribute to a positive and welcoming environment. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Be creative and thoughtful to ensure the questions are intriguing and engaging for people from all walks of life."

  const { completion, complete, isLoading: isSuggestionLoading, error } = useCompletion({
    api: '/api/suggest-message',
    initialCompletion: initialMessageString
  });

  const suggestMessages = async () => {
    try {
      await complete(prompt)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const parseResponse = (response: string) => {
    return response.split("||")
  }

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className="text-4xl font-bold mb-6 text-center">
        Send via Secret Line
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Type your message here'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !formContent}>
                Send
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className='space-y-4 my-8'>
        <div className="space-y-2">
          <Button
            onClick={suggestMessages}
            disabled={isSuggestionLoading}
            className="my-4"
          >
            Suggest Message
          </Button>
        </div>
        <Card>
          <CardHeader>
            <h3 className='text-xl font-semibold text-center'>Suggested Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {
              error ?
                <p className="text-red-500">{error.message}</p>
                : (
                  isSuggestionLoading ? (
                    <div className="flex flex-col space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    parseResponse(completion).map((message, index) => (
                      <Button
                        key={index}
                        variant='outline'
                        onClick={() => handleMessageClick(message)}
                        className='text-wrap text-xs sm:text-base'
                      >
                        {message}
                      </Button>
                    ))
                  )
                )
            }

          </CardContent>

        </Card>
      </div>
    </div>

  )
}

export default SendMessage