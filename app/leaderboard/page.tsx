"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getLeaderboard } from "@/lib/actions/leaderboard";
import { Trophy, Flame, Target, Timer, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeaderboardPage() {
    const [type, setType] = useState<any>("streak");
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            const data = await getLeaderboard(type);
            setUsers(data);
            setIsLoading(false);
        }
        load();
    }, [type]);

    const getMetricIcon = (t: string) => {
        switch (t) {
            case "streak": return <Flame className="w-4 h-4 text-orange-500" />;
            case "accuracy": return <Target className="w-4 h-4 text-green-500" />;
            case "total": return <Trophy className="w-4 h-4 text-yellow-500" />;
            case "time": return <Timer className="w-4 h-4 text-blue-500" />;
        }
    };

    const getMetricValue = (user: any) => {
        switch (type) {
            case "streak": return `${user.streak} days`;
            case "accuracy": return `${(user.accuracy * 100).toFixed(0)}%`;
            case "total": return `${user.total} solved`;
            case "time": return `${user.time.toFixed(1)}s avg`;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
            <Navbar />
            <main className="pt-32 px-4 container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">The Hall of Sparks</h1>
                    <p className="text-neutral-400">Where logic meets speed. Top thinkers from across the globe.</p>
                </div>

                <div className="flex justify-center mb-12">
                    <Tabs value={type} onValueChange={(v) => setType(v)} className="w-full max-w-2xl bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
                        <TabsList className="grid grid-cols-4 w-full h-12 bg-transparent text-neutral-400">
                            <TabsTrigger value="streak" className="rounded-xl data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Streak</TabsTrigger>
                            <TabsTrigger value="accuracy" className="rounded-xl data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Accuracy</TabsTrigger>
                            <TabsTrigger value="total" className="rounded-xl data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Solved</TabsTrigger>
                            <TabsTrigger value="time" className="rounded-xl data-[state=active]:bg-neutral-800 data-[state=active]:text-white">Time</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <Card className="bg-neutral-900 border-neutral-800 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-neutral-800 bg-neutral-800/50">
                                        <th className="px-8 py-5 text-sm font-semibold text-neutral-400 uppercase tracking-wider">Rank</th>
                                        <th className="px-8 py-5 text-sm font-semibold text-neutral-400 uppercase tracking-wider">User</th>
                                        <th className="px-8 py-5 text-sm font-semibold text-neutral-400 uppercase tracking-wider text-right">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    <AnimatePresence mode="popLayout">
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td className="px-8 py-6"><div className="h-4 w-4 bg-neutral-800 rounded" /></td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-neutral-800" />
                                                            <div className="h-4 w-32 bg-neutral-800 rounded" />
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6"><div className="h-4 w-20 bg-neutral-800 rounded ml-auto" /></td>
                                                </tr>
                                            ))
                                        ) : (
                                            users.map((user, i) => (
                                                <motion.tr
                                                    key={user.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={`hover:bg-neutral-800/30 transition-colors group ${i < 3 ? 'bg-violet-500/5' : ''}`}
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            {i === 0 && <span className="text-xl">🥇</span>}
                                                            {i === 1 && <span className="text-xl">🥈</span>}
                                                            {i === 2 && <span className="text-xl">🥉</span>}
                                                            {i > 2 && <span className="text-lg font-mono text-neutral-500">{i + 1}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10 border border-neutral-800 group-hover:border-violet-500/50 transition-colors">
                                                                <AvatarImage src={user.image} />
                                                                <AvatarFallback className="bg-neutral-800 text-neutral-400">
                                                                    <User className="w-5 h-5" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-semibold text-lg">{user.name}</p>
                                                                {i < 10 && <Badge className="text-[10px] h-4 bg-violet-600/20 text-violet-400 border-none">TOP 10</Badge>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 font-bold">
                                                            {getMetricIcon(type)}
                                                            {getMetricValue(user)}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
