import { Metadata } from "next";

const URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteConfig = {
    name: "Daily Spark",
    description: "One brain teaser. One shot at glory. Ignite your mind with daily puzzles.",
    url: URL,
    ogImage: `${URL}/og.png`,
    links: {
        twitter: "https://twitter.com/dailyspark",
    },
};

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        "puzzles",
        "riddles",
        "daily challenge",
        "logic problems",
        "brain teasers",
        "streak",
        "leaderboard",
    ],
    authors: [
        {
            name: "Daily Spark Team",
            url: siteConfig.url,
        },
    ],
    creator: "Daily Spark",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [`${siteConfig.url}/og.png`],
        creator: "@dailyspark",
    },
    icons: {
        icon: "/favicon.ico",
    },
};
