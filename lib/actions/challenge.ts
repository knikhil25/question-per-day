"use server";

import prisma from "@/lib/prisma";
import { getUserProfile } from "./user";
import { revalidatePath } from "next/cache";

import { getPSTDate } from "@/lib/utils/date";

export async function getTodayChallenge() {
    const today = getPSTDate();

    const user = await getUserProfile();

    let challenge = await prisma.challenge.findUnique({
        where: { publishedAt: today },
        include: {
            submissions: {
                where: { userId: user?.id || "anonymous" },
            },
        },
    });

    // Fallback: If no challenge is scheduled for today, pick a random one from 5+ months ago
    if (!challenge) {
        const fiveMonthsAgo = new Date(today);
        fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

        // Count how many challenges exist in that historical window
        const historicalCount = await prisma.challenge.count({
            where: { publishedAt: { lt: fiveMonthsAgo } }
        });

        if (historicalCount > 0) {
            const skip = Math.floor(Math.random() * historicalCount);
            challenge = await prisma.challenge.findFirst({
                where: { publishedAt: { lt: fiveMonthsAgo } },
                skip: skip,
                include: {
                    submissions: {
                        where: { userId: user?.id || "anonymous" },
                    },
                },
            });
        } else {
            // If we don't have 5 months of history yet, just pick a random one from anything older than today
            const totalArchiveCount = await prisma.challenge.count({
                where: { publishedAt: { lt: today } }
            });

            if (totalArchiveCount > 0) {
                const skip = Math.floor(Math.random() * totalArchiveCount);
                challenge = await prisma.challenge.findFirst({
                    where: { publishedAt: { lt: today } },
                    skip: skip,
                    include: {
                        submissions: {
                            where: { userId: user?.id || "anonymous" },
                        },
                    },
                });
            }
        }
    }

    return { challenge, user };
}

export async function submitAnswer(challengeId: string, answer: string, solvedTime: number) {
    const user = await getUserProfile();
    if (!user) throw new Error("Not identified");

    const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
    });

    if (!challenge) throw new Error("Challenge not found");

    const normalize = (str: string) => {
        return str
            .trim()
            .toLowerCase()
            .replace(/^(a|an|the)\s+/i, "") // Remove leading articles
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Remove punctuation
            .replace(/\s+/g, " "); // Normalize spaces
    };

    const isCorrect = normalize(answer) === normalize(challenge.answer);

    // Create submission
    const submission = await prisma.submission.create({
        data: {
            userId: user.id,
            challengeId,
            answer,
            isCorrect,
            solvedTime,
        },
    });

    // Update user stats
    const totalSolved = user.totalSolved + 1;
    const correctAnswers = user.correctAnswers + (isCorrect ? 1 : 0);
    const totalSolveTime = user.totalSolveTime + solvedTime;
    const accuracy = correctAnswers / totalSolved;
    const averageSolveTime = totalSolveTime / totalSolved;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            totalSolved,
            correctAnswers,
            totalSolveTime,
            accuracy,
            averageSolveTime,
        },
    });

    // Update streak
    if (isCorrect) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const currentStreak = await prisma.streak.upsert({
            where: { userId: user.id },
            update: {
                currentStreak: { increment: 1 },
                longestStreak: { set: Math.max(user.streak?.longestStreak || 0, (user.streak?.currentStreak || 0) + 1) },
                lastSubmissionAt: today,
            },
            create: {
                userId: user.id,
                currentStreak: 1,
                longestStreak: 1,
                lastSubmissionAt: today,
            },
        });

        // Badge check: First Spark
        if (totalSolved === 1) {
            const firstSparkBadge = await prisma.badge.findUnique({ where: { name: "First Spark" } });
            if (firstSparkBadge) {
                await prisma.userBadge.upsert({
                    where: { userId_badgeId: { userId: user.id, badgeId: firstSparkBadge.id } },
                    update: {},
                    create: { userId: user.id, badgeId: firstSparkBadge.id }
                });
            }
        }
    } else {
        // Reset streak on wrong answer if you want, but usually daily challenges only increment on success
        // For now let's just keep it simple.
    }

    revalidatePath("/challenge/today");
    revalidatePath("/leaderboard");
    revalidatePath("/profile");

    return { isCorrect, submission };
}
