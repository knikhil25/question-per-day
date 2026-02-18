"use server";

import prisma from "@/lib/prisma";

export async function sendDailyReminders() {
    console.log("Fetching users for daily reminders...");

    // In a real app, you would fetch users who have opted into emails
    // For now, we simulate the process
    const users = await prisma.user.findMany({
        select: { nickname: true },
        take: 10,
    });

    users.forEach((user) => {
        console.log(`[SIMULATED EMAIL] Sending reminder to ${user.nickname}: Today's Spark is live!`);
    });

    return { success: true, count: users.length };
}

export async function postDailyTweet() {
    console.log("[SIMULATED TWEET] New puzzle is live! Check out today's Spark and keep your streak alive. #DailySpark #Puzzle");
    return { success: true };
}
