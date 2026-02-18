import { getTodayChallenge } from "@/lib/actions/challenge";
import { ChallengeClient } from "./challenge-client";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Today's Spark | Daily Challenge",
    description: "One question, once a day. Can you solve it?",
};

export default async function ChallengePage() {
    const { challenge, user } = await getTodayChallenge();

    if (!challenge) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Card className="bg-neutral-950 border-neutral-800 max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <div className="bg-violet-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="text-violet-500 w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No Spark Today</h2>
                        <p className="text-neutral-400">The daily challenge hasn't been published yet. Check back in a few hours!</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Even if user is null, we pass it to ChallengeClient. 
    // ChallengeClient will show the nickname prompt if user is null.
    const initialSubmission = challenge.submissions?.[0] || null;

    return (
        <ChallengeClient
            challenge={challenge}
            initialSubmission={initialSubmission}
            user={user}
        />
    );
}
