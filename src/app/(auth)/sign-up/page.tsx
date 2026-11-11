'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthShell } from '@/components/AuthShell';
import { SubmitButton } from '@/components/SubmitButton';
import { UsernameStatus } from '@/components/UsernameStatus';

function SignUpForm() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { username: '', email: '', password: '' },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (!username) {
                setUsernameMessage('');
                return;
            }
            setIsCheckingUsername(true);
            setUsernameMessage('');
            try {
                const response = await axios.post('/api/check-username-unique', { username });
                setUsernameMessage(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message ?? 'Couldn’t check that username. Try again.');
            } finally {
                setIsCheckingUsername(false);
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast.success(response.data.message);
            router.replace(`/verify/${data.username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Sign up failed. Try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <AuthShell
            title="Create your link"
            description="Pick a username. People will use it to find your page and leave you notes."
            footer={
                <>
                    Already have a link?{' '}
                    <Link href="/sign-in" className="font-medium text-foreground underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-foreground">
                        Sign in
                    </Link>
                </>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground">
                                            @
                                        </span>
                                        <Input
                                            autoComplete="username"
                                            autoFocus
                                            className="pl-8"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <UsernameStatus
                                    checking={isCheckingUsername}
                                    message={usernameMessage}
                                    available={usernameMessage === 'Username is unique'}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" autoComplete="email" {...field} />
                                </FormControl>
                                <FormDescription>We’ll send a 6-digit code to verify it.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" autoComplete="new-password" {...field} />
                                </FormControl>
                                <FormDescription>At least 8 characters.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SubmitButton pending={isSubmitting} pendingLabel="Creating account" size="lg" className="mt-2 w-full">
                        Create account
                    </SubmitButton>
                </form>
            </Form>
        </AuthShell>
    );
}

export default SignUpForm;
