"use server";

import prisma from "@/lib/prisma";

export async function createLeaderboardSnapshot(type: "daily" | "weekly" | "monthly") {
    const users = await prisma.user.findMany({
        take: 100,
        orderBy: { correctAnswers: "desc" },
        include: { streak: true },
        where: { totalSolved: { gt: 0 } },
    });

    const snapshotData = users.map((u, i) => ({
        rank: i + 1,
        userId: u.id,
        nickname: u.nickname,
        score: u.correctAnswers,
        streak: u.streak?.currentStreak || 0,
    }));

    const snapshot = await prisma.leaderboardSnapshot.create({
        data: {
            type,
            data: JSON.stringify(snapshotData),
        },
    });

    return snapshot;
}

export async function getLatestSnapshot(type: "daily" | "weekly" | "monthly") {
    const snapshot = await prisma.leaderboardSnapshot.findFirst({
        where: { type },
        orderBy: { timestamp: "desc" },
    });

    if (!snapshot) return null;
    return JSON.parse(snapshot.data);
}
