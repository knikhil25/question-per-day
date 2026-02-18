"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { createChallenge, getChallenges, deleteChallenge } from "@/lib/actions/admin";
import { toast } from "sonner";
import { PlusCircle, Loader2, Trash2, Calendar } from "lucide-react";
import { formatPST, getPSTDate } from "@/lib/utils/date";

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [challenges, setChallenges] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        explanation: "",
        difficulty: "Medium",
        topic: "Logic",
        publishedAt: getPSTDate().toISOString().split("T")[0],
    });

    useEffect(() => {
        loadChallenges();
    }, []);

    async function loadChallenges() {
        const data = await getChallenges();
        setChallenges(data);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Force UTC midnight to prevent timezone shifting
            const selectedDate = new Date(`${formData.publishedAt}T00:00:00Z`);

            const exists = challenges.some(c => {
                const cDate = new Date(c.publishedAt);
                return cDate.getTime() === selectedDate.getTime();
            });

            if (exists) {
                const proceed = confirm(`A challenge already exists for ${formData.publishedAt}. Do you want to overwrite it?`);
                if (!proceed) {
                    setIsLoading(false);
                    return;
                }
            }

            await createChallenge({
                ...formData,
                publishedAt: selectedDate,
            });
            toast.success("Challenge upserted successfully!");
            setFormData({
                ...formData,
                question: "",
                answer: "",
                explanation: "",
            });
            await loadChallenges();
        } catch (error: any) {
            toast.error(error.message || "Failed to save challenge");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteChallenge(id);
            toast.success("Challenge deleted");
            await loadChallenges();
        } catch (error: any) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 pb-20">
            <Navbar />
            <main className="pt-32 px-4 container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div>
                        <Card className="bg-neutral-900 border-neutral-800 rounded-3xl overflow-hidden shadow-2xl glass">
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-3xl font-bold">Manage Sparks</CardTitle>
                                <p className="text-xs text-neutral-500 mt-2 uppercase tracking-widest font-mono">
                                    Current Server Time (PST): {new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })}
                                </p>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400">Question</label>
                                        <Textarea
                                            required
                                            placeholder="Enter the riddle or puzzle..."
                                            className="bg-neutral-800 border-neutral-700 rounded-xl min-h-[120px]"
                                            value={formData.question}
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400">Answer</label>
                                        <Input
                                            required
                                            placeholder="The correct answer..."
                                            className="bg-neutral-800 border-neutral-700 rounded-xl"
                                            value={formData.answer}
                                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400">Explanation</label>
                                        <Textarea
                                            required
                                            placeholder="Why is it the correct answer?"
                                            className="bg-neutral-800 border-neutral-700 rounded-xl min-h-[100px]"
                                            value={formData.explanation}
                                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400">Difficulty</label>
                                            <Select
                                                value={formData.difficulty}
                                                onValueChange={(v) => setFormData({ ...formData, difficulty: v })}
                                            >
                                                <SelectTrigger className="bg-neutral-800 border-neutral-700 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-neutral-900 border-neutral-800">
                                                    <SelectItem value="Easy">Easy</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="Hard">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400">Topic</label>
                                            <Input
                                                required
                                                className="bg-neutral-800 border-neutral-700 rounded-xl"
                                                value={formData.topic}
                                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-400">Publish Date</label>
                                        <Input
                                            type="date"
                                            required
                                            className="bg-neutral-800 border-neutral-700 rounded-xl"
                                            value={formData.publishedAt}
                                            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-violet-600/20 transition-all active:scale-95"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <PlusCircle className="w-5 h-5" />
                                                Save Challenge
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Challenges List Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-violet-500" />
                            Scheduled Sparks
                        </h2>
                        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            {challenges.map((c) => (
                                <Card key={c.id} className="bg-neutral-900/50 border-neutral-800 rounded-2xl">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-1">
                                                    {formatPST(c.publishedAt)}
                                                </p>
                                                <h3 className="font-bold text-neutral-200 line-clamp-1">{c.question}</h3>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={() => handleDelete(c.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-neutral-800 px-2 py-1 rounded-md text-neutral-400">{c.difficulty}</span>
                                            <span className="text-xs bg-neutral-800 px-2 py-1 rounded-md text-neutral-400">{c.topic}</span>
                                            <span className="text-xs text-neutral-500 ml-auto">Answer: {c.answer}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {challenges.length === 0 && (
                                <div className="text-center py-12 text-neutral-500">No challenges scheduled.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
