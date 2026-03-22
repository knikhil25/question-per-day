"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Trophy, User, LogOut } from "lucide-react";
import { logout } from "@/lib/actions/user";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [nickname, setNickname] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Read cookie DS_NICKNAME
        const name = document.cookie
            .split("; ")
            .find((row) => row.startsWith("ds_nickname="))
            ?.split("=")[1];

        if (name) setNickname(decodeURIComponent(name));
    }, []);

    const handleLogout = async () => {
        await logout();
        setNickname(null);
        router.push("/");
        router.refresh();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-400">
                        Daily Spark
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/challenge/today" className="text-sm font-medium text-neutral-400 hover:text-neutral-50 transition-colors">
                        Today's Challenge
                    </Link>
                    <Link href="/leaderboard" className="text-sm font-medium text-neutral-400 hover:text-neutral-50 transition-colors">
                        Leaderboard
                    </Link>
                    <Link href="/archive" className="text-sm font-medium text-neutral-400 hover:text-neutral-50 transition-colors">
                        Archive
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {nickname ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 px-4 rounded-xl border border-neutral-800 flex items-center gap-2 hover:bg-neutral-900">
                                    <Avatar className="h-6 w-6 border-none">
                                        <AvatarFallback className="bg-violet-600 text-[10px] text-white">
                                            {nickname[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-neutral-300">{nickname}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800 text-neutral-200 p-2 rounded-2xl shadow-2xl">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer p-3 rounded-xl focus:bg-neutral-800">
                                        <User className="w-4 h-4 text-violet-400" /> My Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/leaderboard" className="flex items-center gap-2 cursor-pointer p-3 rounded-xl focus:bg-neutral-800">
                                        <Trophy className="w-4 h-4 text-yellow-400" /> Rankings
                                    </Link>
                                </DropdownMenuItem>
                                <div className="h-px bg-neutral-800 my-1" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/challenge/today?rename=true"
                                        className="flex items-center gap-2 text-neutral-400 focus:text-white cursor-pointer p-3 rounded-xl focus:bg-neutral-800"
                                    >
                                        <LogOut className="w-4 h-4" /> Change Nickname
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            asChild
                            className="bg-neutral-50 text-neutral-950 hover:bg-neutral-200 rounded-xl"
                        >
                            <Link href="/challenge/today">Get Started</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
