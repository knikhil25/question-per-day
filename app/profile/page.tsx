"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserProfile } from "@/lib/actions/user";
import { Flame, Trophy, Target, Timer, CheckCircle2, XCircle, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            const data = await getUserProfile();
            setUser(data);
            setIsLoading(false);
        }
        load();
    }, []);

    if (isLoading) return <div className="min-h-screen bg-neutral-950" />;
    if (!user) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Please sign in.</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
            <Navbar />
            <main className="pt-32 px-4 container mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
                    <Avatar className="h-32 w-32 border-4 border-neutral-900 shadow-2xl">
                        <AvatarFallback className="text-4xl bg-neutral-800 uppercase">{user.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2">{user.nickname}</h1>
                        <p className="text-neutral-400 mb-4">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {user.badges.map((ub: any) => (
                                <Badge key={ub.id} className="bg-violet-600/20 text-violet-300 border-violet-500/30 px-3 py-1 rounded-full">
                                    {ub.badge.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { icon: <Flame className="w-5 h-5 text-orange-500" />, label: "Current Streak", value: `${user.streak?.currentStreak || 0}d` },
                        { icon: <Trophy className="w-5 h-5 text-yellow-500" />, label: "Max Streak", value: `${user.streak?.longestStreak || 0}d` },
                        { icon: <Target className="w-5 h-5 text-green-500" />, label: "Accuracy", value: `${(user.accuracy || 0 * 100).toFixed(0)}%` },
                        { icon: <Timer className="w-5 h-5 text-blue-500" />, label: "Avg Time", value: `${(user.averageSolveTime || 0).toFixed(1)}s` }
                    ].map((stat, i) => (
                        <Card key={i} className="bg-neutral-900 border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-xl bg-neutral-800">{stat.icon}</div>
                                    <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">{stat.label}</span>
                                </div>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-violet-500" />
                            Recent Sparks
                        </h2>
                        <div className="space-y-4">
                            {user.submissions.map((sub: any) => (
                                <Card key={sub.id} className="bg-neutral-900/50 border-neutral-800 rounded-2xl hover:bg-neutral-800 transition-colors cursor-pointer">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold mb-1 truncate max-w-xs">{sub.challenge.question}</h4>
                                            <p className="text-xs text-neutral-500">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-mono text-neutral-400">{sub.solvedTime}s</span>
                                            {sub.isCorrect ? <CheckCircle2 className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Flame className="w-6 h-6 text-orange-500" />
                            Brain Heatmap
                        </h2>
                        <Card className="bg-neutral-900 border-neutral-800 rounded-3xl p-6">
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-sm ${Math.random() > 0.6 ? "bg-violet-600/60" : "bg-neutral-800"}`} />
                                ))}
                            </div>
                            <p className="text-xs text-neutral-500 mt-4 text-center">Last 4 weeks of activity</p>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
