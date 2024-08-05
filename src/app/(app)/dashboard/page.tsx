'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import MessageTable from '@/components/MessageTable';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { Loader2, RefreshCcw } from 'lucide-react';

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessage = watch('acceptMessage');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message');
      setValue('acceptMessage', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        acceptMessage: !acceptMessage,
      });
      setValue('acceptMessage', !acceptMessage);
      toast({
        description: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { username } = session?.user as User || '';
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL copied',
      description: 'Profile URL has been copied to the clipboard',
    });
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className="my-0 mx-4 md:mx-8 md:my-8 lg:mx-auto p-1 sm:p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-center sm:text-left">User Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Copy Your Unique Link</h2>
        <div className="flex items-center space-x-4">
          <input
            id="url"
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-3 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={copyToClipboard} className="rounded-md px-4 py-2">
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-lg font-medium">Accept Messages: {acceptMessage ? 'On' : 'Off'}</span>
      </div>
      <Separator />

      <div className='flex justify-center'>
      <Button
        className="mt-6 mb-3 flex space-x-2 px-4 py-2 border border-gray-300 rounded-md"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <RefreshCcw className="h-5 w-5" />
        )}
        <span>Refresh Messages</span>
      </Button>
      </div>

      <div className="container mx-auto px-2 md:px-4 lg:px-8">
        <MessageTable data={messages} onMessageDelete={handleDeleteMessage} />
      </div>
    </div>
  );
}

export default Dashboard;
