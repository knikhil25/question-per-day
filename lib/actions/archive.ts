"use server";

import prisma from "@/lib/prisma";
import { getPSTDate } from "@/lib/utils/date";

export async function getArchive(filters?: { topic?: string; difficulty?: string }) {
    const challenges = await prisma.challenge.findMany({
        where: {
            publishedAt: { lt: getPSTDate() },
            ...(filters?.topic && filters.topic !== "all" ? { topic: filters.topic } : {}),
            ...(filters?.difficulty && filters.difficulty !== "all" ? { difficulty: filters.difficulty } : {}),
        },
        orderBy: { publishedAt: "desc" },
    });

    return challenges;
}
