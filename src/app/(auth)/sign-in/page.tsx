'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthShell } from '@/components/AuthShell';
import { SubmitButton } from '@/components/SubmitButton';
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: { identifier: '', password: '' },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        setIsSubmitting(false);

        if (result?.error) {
            toast.error(
                result.error === 'CredentialsSignin'
                    ? 'That email/username and password don’t match. Check both and try again.'
                    : result.error
            );
            return;
        }

        if (result?.url) {
            toast.success('Signed in');
            router.replace('/dashboard');
        }
    };

    return (
        <AuthShell
            title="Welcome back"
            description="Sign in to read your notes."
            footer={
                <>
                    New to Secret Line?{' '}
                    <Link href="/sign-up" className="font-medium text-foreground underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-foreground">
                        Get your link
                    </Link>
                </>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        name="identifier"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or username</FormLabel>
                                <FormControl>
                                    <Input autoComplete="username" autoFocus {...field} />
                                </FormControl>
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
                                    <Input type="password" autoComplete="current-password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SubmitButton pending={isSubmitting} pendingLabel="Signing in" size="lg" className="mt-2 w-full">
                        Sign in
                    </SubmitButton>
                </form>
            </Form>
        </AuthShell>
    );
}
