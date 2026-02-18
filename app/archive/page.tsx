"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { getArchive } from "@/lib/actions/archive";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Filter, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPST } from "@/lib/utils/date";

export default function ArchivePage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            const data = await getArchive();
            setChallenges(data);
            setIsLoading(false);
        }
        load();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
            <Navbar />
            <main className="pt-32 px-4 container mx-auto max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">The Spark Archives</h1>
                        <p className="text-neutral-400">Relive the highlights. Every challenge ever published.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="h-10 px-4 rounded-xl border-neutral-800 bg-neutral-900 text-neutral-400 cursor-pointer hover:bg-neutral-800 transition-colors">
                            <Filter className="w-4 h-4 mr-2" /> All Topics
                        </Badge>
                        <Badge variant="outline" className="h-10 px-4 rounded-xl border-neutral-800 bg-neutral-900 text-neutral-400 cursor-pointer hover:bg-neutral-800 transition-colors">
                            <Search className="w-4 h-4 mr-2" /> Search
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-64 bg-neutral-900 animate-pulse rounded-[2rem] border border-neutral-800" />
                        ))
                    ) : (
                        challenges.map((c, i) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="bg-neutral-900 border-neutral-800 rounded-[2rem] overflow-hidden group hover:border-violet-500/50 transition-all hover:shadow-2xl hover:shadow-violet-500/10">
                                    <CardContent className="p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {formatPST(c.publishedAt)}
                                            </span>
                                            <Badge className="bg-neutral-800 border-none text-[10px] text-neutral-400">
                                                {c.difficulty}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold mb-6 line-clamp-3 group-hover:text-violet-400 transition-colors">
                                            "{c.question}"
                                        </h3>
                                        <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                                            <span className="text-sm text-neutral-500 font-medium">#{c.topic}</span>
                                            <Link
                                                href={`/challenge/archive/${c.id}`}
                                                className="text-sm font-bold border-b border-white/0 hover:border-white transition-all"
                                            >
                                                View Solution
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
