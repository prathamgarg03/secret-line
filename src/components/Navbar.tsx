'use client';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, LogIn, LogOut, User2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className='fixed top-0 left-0 right-0 py-6 px-1 md:p-6 bg-white shadow-md z-50'>
            <div className='container mx-auto flex flex-row justify-between items-center'>
                <div className='text-2xl font-extrabold text-gray-800'>
                    Secret Line
                </div>
                <div>
                    {session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className='cursor-pointer'>
                                    <AvatarFallback>
                                        <User2 className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Link href='/profile' className='p-0 m-0'>
                                        <Button variant="ghost" className='p-0 m-0'>
                                            <User2 className="h-4 w-4 p-0 m-0 mr-2" />
                                            Profile
                                        </Button>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href='/dashboard' className='p-0 m-0'>
                                        <Button variant="ghost" className='p-0 m-0'>
                                            <LayoutDashboard className="h-4 w-4 p-0 m-0 mr-2" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button variant="ghost" className='p-0 m-0' onClick={() => signOut()}>
                                        <LogOut className="h-4 w-4 p-0 m-0 mr-2" />
                                        Sign Out
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    ) : (
                        <Link href='/sign-in'>
                            <Button className='rounded-full'>
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
