'use client';

import { useEffect, useState } from 'react';
import type { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmitButton } from '@/components/SubmitButton';
import { UsernameStatus } from '@/components/UsernameStatus';
import { resetPasswordSchema, usernameSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { blurUp, ease, spring, stagger } from '@/lib/motion';

type Tab = 'username' | 'password';

const tabs: { value: Tab; label: string }[] = [
    { value: 'username', label: 'Username' },
    { value: 'password', label: 'Password' },
];

function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user as User | undefined;
    const [tab, setTab] = useState<Tab>('username');

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameSubmitting, setIsUsernameSubmitting] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (!username) {
                setUsernameMessage('');
                return;
            }
            if (username === user?.username) {
                setUsernameMessage('That’s already your username');
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
    }, [username, user?.username]);

    const usernameForm = useForm<z.infer<typeof usernameSchema>>({
        resolver: zodResolver(usernameSchema),
        defaultValues: { username: '' },
    });

    const passwordForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onUsernameSubmit = async (data: z.infer<typeof usernameSchema>) => {
        setIsUsernameSubmitting(true);
        try {
            const response = await axios.post('/api/update-username', {
                oldUsername: user?.username,
                newUsername: data.username,
            });
            toast.success(response.data.message, { description: 'Sign in again with your new username.' });
            signOut({ callbackUrl: '/sign-in' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Couldn’t change your username. Try again.');
        } finally {
            setIsUsernameSubmitting(false);
        }
    };

    const onPasswordSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setIsPasswordSubmitting(true);
        try {
            const response = await axios.post('/api/update-password', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                username: user?.username,
            });
            toast.success(response.data.message, { description: 'Sign in again with your new password.' });
            signOut({ callbackUrl: '/sign-in' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Couldn’t change your password. Try again.');
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    const passwordFields = [
        { name: 'oldPassword', label: 'Current password', autoComplete: 'current-password' },
        { name: 'newPassword', label: 'New password', autoComplete: 'new-password' },
        { name: 'confirmPassword', label: 'Confirm new password', autoComplete: 'new-password' },
    ] as const;

    return (
        <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="container max-w-xl pt-12 pb-16 sm:pt-16">
            <motion.h1 variants={blurUp} className="text-3xl sm:text-4xl">Settings</motion.h1>
            <motion.p variants={blurUp} className="mt-1.5 text-muted-foreground">
                Changing either one signs you out so you can sign back in with the new details.
            </motion.p>
            <motion.div variants={blurUp}>

            <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-10">
                <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
                    {tabs.map((t) => (
                        <TabsTrigger
                            key={t.value}
                            value={t.value}
                            className="relative rounded-none bg-transparent px-0 pb-3 text-sm font-normal text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:text-foreground"
                        >
                            {t.label}
                            {tab === t.value && (
                                <motion.span
                                    layoutId="settings-tab"
                                    className="absolute inset-x-0 -bottom-px h-px bg-foreground"
                                    transition={spring}
                                />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="mt-6">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                        transition={{ duration: 0.25, ease }}
                        role="tabpanel"
                    >
                        {tab === 'username' ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change username</CardTitle>
                                    <CardDescription>
                                        Your link changes too. Anyone using your old link will need the new one.
                                    </CardDescription>
                                </CardHeader>
                                <Form {...usernameForm}>
                                    <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}>
                                        <CardContent>
                                            <FormField
                                                name="username"
                                                control={usernameForm.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>New username</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-muted-foreground">
                                                                    @
                                                                </span>
                                                                <Input
                                                                    placeholder={user?.username}
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
                                        </CardContent>
                                        <CardFooter className="justify-end border-t pt-5">
                                            <SubmitButton pending={isUsernameSubmitting} pendingLabel="Saving">
                                                Change username
                                            </SubmitButton>
                                        </CardFooter>
                                    </form>
                                </Form>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change password</CardTitle>
                                    <CardDescription>Use at least 8 characters.</CardDescription>
                                </CardHeader>
                                <Form {...passwordForm}>
                                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                                        <CardContent className="space-y-4">
                                            {passwordFields.map((f) => (
                                                <FormField
                                                    key={f.name}
                                                    name={f.name}
                                                    control={passwordForm.control}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{f.label}</FormLabel>
                                                            <FormControl>
                                                                <Input type="password" autoComplete={f.autoComplete} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </CardContent>
                                        <CardFooter className="justify-end border-t pt-5">
                                            <SubmitButton pending={isPasswordSubmitting} pendingLabel="Saving">
                                                Change password
                                            </SubmitButton>
                                        </CardFooter>
                                    </form>
                                </Form>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            </motion.div>
        </motion.div>
    );
}

export default ProfilePage;
