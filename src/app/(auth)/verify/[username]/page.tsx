'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { AuthShell } from '@/components/AuthShell';
import { SubmitButton } from '@/components/SubmitButton';

function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: '' },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code,
            });
            toast.success(response.data.message);
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'That code didn’t work. Check your email and try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <AuthShell
            title="Check your email"
            description={
                <>
                    Enter the 6-digit code we sent to verify{' '}
                    <span className="font-medium text-foreground">@{decodeURIComponent(params.username)}</span>.
                </>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                                <FormControl>
                                    <InputOTP maxLength={6} autoFocus {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator className="text-muted-foreground" />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SubmitButton pending={isSubmitting} pendingLabel="Verifying" size="lg" className="mt-2 w-full">
                        Verify account
                    </SubmitButton>
                </form>
            </Form>
        </AuthShell>
    );
}

export default VerifyAccount;
