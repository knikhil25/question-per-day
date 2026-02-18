"use client";

import { useState } from "react";
import { setNickname } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function NicknamePrompt() {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const referralCode = searchParams.get("ref");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            await setNickname(name.trim(), referralCode || undefined);
            router.push(window.location.pathname);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to set nickname");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <Card className="max-w-md w-full bg-neutral-900 border-neutral-800 shadow-2xl glass rounded-[2rem] overflow-hidden">
                    <CardHeader className="text-center pt-10">
                        <div className="mx-auto bg-violet-600/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 border border-violet-500/20">
                            <Zap className="text-violet-400 w-8 h-8 fill-violet-400/20" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-white tracking-tight">Who's Sparking?</CardTitle>
                        <CardDescription className="text-neutral-400 mt-2">
                            Enter a nickname to track your streaks and climb the leaderboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-10 px-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                placeholder="e.g. Brainiac42"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-neutral-800 border-neutral-700 h-14 text-lg rounded-2xl focus-visible:ring-violet-500 px-6"
                                autoFocus
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-violet-600/20 transition-all active:scale-95"
                                disabled={isLoading}
                            >
                                {isLoading ? "Setting up..." : "Start Solving"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
