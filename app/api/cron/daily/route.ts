import { NextResponse } from "next/server";
import { createLeaderboardSnapshot } from "@/lib/actions/leaderboard-snapshots";
import { sendDailyReminders, postDailyTweet } from "@/lib/actions/notifications";

export async function GET(request: Request) {
    // In production, you would check for a secret header from Vercel Cron
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    try {
        console.log("Running Daily Spark Maintenance...");

        // 1. Snapshot the leaderboard
        await createLeaderboardSnapshot("daily");

        // 2. Send reminders
        await sendDailyReminders();

        // 3. Post to social
        await postDailyTweet();

        return NextResponse.json({ success: true, message: "Maintenance completed" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
