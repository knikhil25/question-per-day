"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { normalizeDate } from "@/lib/utils/date";

export async function createChallenge(data: {
    question: string;
    answer: string;
    explanation: string;
    difficulty: string;
    topic: string;
    publishedAt: Date;
}) {
    const normalizedDate = normalizeDate(data.publishedAt);

    const challenge = await prisma.challenge.upsert({
        where: { publishedAt: normalizedDate },
        update: {
            ...data,
            publishedAt: normalizedDate,
        },
        create: {
            ...data,
            publishedAt: normalizedDate,
        },
    });

    revalidatePath("/archive");
    revalidatePath("/challenge/today");
    return challenge;
}

export async function getChallenges() {
    return await prisma.challenge.findMany({
        orderBy: { publishedAt: "desc" },
    });
}

export async function deleteChallenge(id: string) {
    await prisma.challenge.delete({ where: { id } });
    revalidatePath("/archive");
    revalidatePath("/challenge/today");
    return { success: true };
}
