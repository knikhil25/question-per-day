"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    Timer,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Share2,
    Trophy,
    Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { submitAnswer } from "@/lib/actions/challenge";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NicknamePrompt } from "@/components/nickname-prompt";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface ChallengeClientProps {
    challenge: any;
    initialSubmission: any;
    user: any;
}

export function ChallengeClient({ challenge, initialSubmission, user }: ChallengeClientProps) {
    const searchParams = useSearchParams();
    const isRenaming = searchParams.get("rename") === "true";
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submission, setSubmission] = useState(initialSubmission);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!submission && user) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [submission, user]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!answer.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await submitAnswer(challenge.id, answer, timer);
            setSubmission(result.submission);

            if (result.submission.isCorrect) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#8b5cf6", "#3b82f6", "#ffffff"]
                });
                toast.success("Correct! You're a spark!");
            } else {
                toast.error("Not quite right. Try again tomorrow!");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    if (!user || isRenaming) {
        return (
            <Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
                <NicknamePrompt />
            </Suspense>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
                {!submission ? (
                    <motion.div
                        key="challenge"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <Badge variant="outline" className="border-neutral-800 bg-neutral-900/50 text-neutral-400 px-3 py-1">
                                {challenge.topic} • {challenge.difficulty}
                            </Badge>
                            <div className="flex items-center gap-2 text-xl font-mono text-violet-400">
                                <Timer className="w-5 h-5" />
                                {formatTime(timer)}
                            </div>
                        </div>

                        <Card className="bg-neutral-900 border-neutral-800 rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
                            <CardContent className="p-8 md:p-12">
                                <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-snug">
                                    {challenge.question}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="relative group">
                                        <Input
                                            placeholder="Type your answer here..."
                                            className="h-16 bg-neutral-950 border-neutral-800 rounded-2xl text-lg px-6 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            disabled={isSubmitting}
                                            autoFocus
                                        />
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                        <p className="text-[10px] text-neutral-500 mt-2 ml-1 uppercase tracking-widest font-medium">
                                            Note: Please don't write "a" or "an" in your answer.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-lg font-bold shadow-lg shadow-violet-600/20 transition-all active:scale-[0.98]"
                                        disabled={!answer.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? "Igniting..." : "Submit Answer"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    >
                        <Card className={`relative overflow-hidden rounded-[2.5rem] border-2 ${submission.isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'} mb-8`}>
                            <CardContent className="p-10 text-center">
                                <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${submission.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {submission.isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                                </div>

                                <h2 className="text-3xl font-bold mb-2">
                                    {submission.isCorrect ? "Brilliant Work!" : "Maybe Tomorrow..."}
                                </h2>
                                <p className="text-neutral-400 mb-8">
                                    {submission.isCorrect
                                        ? `You solved it in ${formatTime(submission.solvedTime)}!`
                                        : "That wasn't the correct answer, but the fire is still burning."}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Your Answer</p>
                                        <p className="font-semibold text-neutral-200">{submission.answer}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Correct Answer</p>
                                        <p className="font-semibold text-green-400">{challenge.answer}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-14 rounded-xl border-neutral-800 gap-2 hover:bg-neutral-800"
                                        onClick={() => {
                                            const url = `${window.location.origin}/challenge/today?ref=${user.nickname}`;
                                            navigator.clipboard.writeText(`I solved today's Spark in ${formatTime(submission.solvedTime)}! Challenge me: ${url}`);
                                            toast.success("Referral link copied to clipboard!");
                                        }}
                                    >
                                        <Share2 className="w-4 h-4" /> Share Challenge
                                    </Button>
                                    <Button asChild className="flex-1 h-14 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200">
                                        <a href="/leaderboard" className="flex items-center justify-center gap-2">
                                            <Trophy className="w-4 h-4" /> View Leaderboard
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="explanation" className="border-neutral-800 bg-neutral-900/50 rounded-2xl px-6">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5 text-violet-400" />
                                        <span className="text-lg font-semibold">Scientific Explanation</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-neutral-400 leading-relaxed pb-6 text-lg">
                                    {challenge.explanation}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
