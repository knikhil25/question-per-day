"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getLeaderboard(type: "streak" | "accuracy" | "total" | "time") {
    let orderBy: Prisma.UserOrderByWithRelationInput = {};

    switch (type) {
        case "streak":
            orderBy = { streak: { currentStreak: "desc" } };
            break;
        case "accuracy":
            orderBy = { accuracy: "desc" };
            break;
        case "total":
            orderBy = { totalSolved: "desc" };
            break;
        case "time":
            orderBy = { averageSolveTime: "asc" };
            break;
    }

    const users = await prisma.user.findMany({
        take: 50,
        orderBy,
        include: {
            streak: true,
        },
        where: {
            totalSolved: { gt: 0 }
        }
    });

    return users.map((u, i: number) => ({
        rank: i + 1,
        id: u.id,
        name: u.nickname || "Anonymous Spark",
        image: null,
        streak: u.streak?.currentStreak || 0,
        accuracy: u.accuracy || 0,
        total: u.totalSolved,
        time: u.averageSolveTime || 0,
    }));
}
