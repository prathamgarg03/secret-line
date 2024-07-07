'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { User } from "@/model/User";
import { usernameSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

function ProfilePage() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                if (username === user?.username) {
                    setUsernameMessage("Please choose a new username");
                    setIsCheckingUsername(false);
                } else {
                    try {
                        const response = await axios.get(`/api/check-username-unique?username=${username}`);
                        setUsernameMessage(response.data.message);

                    } catch (error) {
                        const axiosError = error as AxiosError<ApiResponse>;
                        setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                    } finally {
                        setIsCheckingUsername(false);
                    }
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const form = useForm<z.infer<typeof usernameSchema>>({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: ''
        }
    });

    const onUsernameSubmit = (data: z.infer<typeof usernameSchema>) => {
        console.log('Form submitted:', data)
    };

    return (
        <div className="flex flex-col items-center mt-28 gap-y-5">
            <div>
                <h1 className="text-xl font-bold">Update your profile</h1>
            </div>
            <Tabs defaultValue="username" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="username">Username</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="username">
                    <Card>
                        <CardHeader>
                            <CardTitle>Username</CardTitle>
                            <CardDescription>
                                Change your username here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onUsernameSubmit)}>
                                <CardContent className="space-y-2">
                                    <FormField
                                        name="username"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            debounced(e.target.value);
                                                        }}
                                                    />
                                                </FormControl>
                                                {isCheckingUsername &&
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                }
                                                <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                                    {usernameMessage}
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit">Save Changes</Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Current password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New password</Label>
                                <Input id="new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProfilePage;
