import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const staticRoutes = [
        "",
        "/challenge/today",
        "/leaderboard",
        "/archive",
        "/profile",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Add all archive challenges
    try {
        const challenges = await prisma.challenge.findMany({
            select: { id: true, updatedAt: true },
        });

        const challengeRoutes = challenges.map((challenge: { id: string; updatedAt: Date }) => ({
            url: `${baseUrl}/challenge/${challenge.id}`,
            lastModified: challenge.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.5,
        }));

        return [...staticRoutes, ...challengeRoutes];
    } catch (error) {
        console.error("Error generating challenge routes for sitemap:", error);
        return staticRoutes;
    }
}
