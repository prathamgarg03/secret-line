'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import type { User } from 'next-auth';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/Logo';
import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/dashboard', label: 'Inbox' },
    { href: '/profile', label: 'Settings' },
];

function Navbar() {
    const { data: session, status } = useSession();
    const user = session?.user as User | undefined;
    const pathname = usePathname();
    const [hovered, setHovered] = useState<string | null>(null);

    // The bottom hairline only appears once the page scrolls under the bar.
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 4));

    return (
        <header
            className={cn(
                'sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
                scrolled ? 'border-border bg-background/75 backdrop-blur-xl' : 'border-transparent bg-transparent'
            )}
        >
            <nav className="container flex h-16 items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <Logo href={session ? '/dashboard' : '/'} />
                    {session && (
                        <ul className="hidden items-center sm:flex" onMouseLeave={() => setHovered(null)}>
                            {navLinks.map((link) => {
                                const active = pathname.startsWith(link.href);
                                return (
                                    <li key={link.href} className="relative">
                                        <Link
                                            href={link.href}
                                            onMouseEnter={() => setHovered(link.href)}
                                            className={cn(
                                                'relative z-10 block px-3 py-1.5 text-sm transition-colors duration-200 focus-visible:outline-hidden',
                                                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                        {hovered === link.href && (
                                            <motion.span
                                                layoutId="nav-hover"
                                                className="absolute inset-0 rounded-md bg-zinc-100"
                                                transition={spring}
                                            />
                                        )}
                                        {active && (
                                            <motion.span
                                                layoutId="nav-active"
                                                className="absolute inset-x-3 -bottom-[17px] h-px bg-foreground"
                                                transition={spring}
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {status === 'loading' ? (
                        <div className="size-8 animate-pulse rounded-full bg-zinc-100" />
                    ) : session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    aria-label="Account menu"
                                    className="flex size-8 items-center justify-center rounded-full border bg-card text-[13px] font-medium shadow-[var(--shadow-hairline)] transition-colors hover:border-zinc-300 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-iris/15"
                                >
                                    {user?.username?.charAt(0).toUpperCase()}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="w-52 rounded-xl p-1 shadow-[var(--shadow-float)]">
                                <DropdownMenuLabel className="px-2.5 py-2 font-normal">
                                    <p className="text-xs text-muted-foreground">Signed in as</p>
                                    <p className="truncate text-sm font-medium">@{user?.username}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer rounded-md px-2.5 sm:hidden">
                                    <Link href="/dashboard">Inbox</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer rounded-md px-2.5 sm:hidden">
                                    <Link href="/profile">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer gap-2 rounded-md px-2.5 text-muted-foreground"
                                    onSelect={() => signOut({ callbackUrl: '/' })}
                                >
                                    <LogOut className="size-4" /> Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/sign-in">Sign in</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/sign-up">Get your link</Link>
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
