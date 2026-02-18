const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const dbPath = `file:${path.join(__dirname, "..", "dev.db")}`;
const adapterFactory = new PrismaLibSql({
    url: dbPath,
});
const prisma = new PrismaClient({ adapter: adapterFactory });

function getPSTDate(date = new Date()) {
    const dateString = date.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    return new Date(dateString + 'T00:00:00Z');
}

async function main() {
    console.log(`Seeding database at ${dbPath}...`);

    const challenges = [
        {
            question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
            answer: "Echo",
            explanation: "An echo is a sound that is repeated because the sound waves are reflected back from a surface. It 'speaks' by reflecting sound and 'hears' by receiving it, requiring no physical body.",
            difficulty: "Easy",
            topic: "Riddle",
            publishedAt: getPSTDate(),
        },
        {
            question: "What has keys but no locks, space but no room, and allows you to enter but never leave?",
            answer: "Keyboard",
            explanation: "A keyboard has keys (letters/numbers) and a space bar. You use the 'Enter' key to input data, but it's not a physical room you can leave.",
            difficulty: "Easy",
            topic: "Logic",
            publishedAt: getPSTDate(new Date(Date.now() - 86400000)),
        },
        {
            question: "In a certain house, a detective finds a body. The man was shot. The detective finds a cassette recorder. He presses play and hears: 'I have no reason to live anymore. I am going to end it all.' Then a gunshot is heard. The detective immediately knows it was murder. Why?",
            answer: "Rewound",
            explanation: "If the man had shot himself while recording, he wouldn't have been able to rewind the tape after he was dead. The detective knew someone else must have rewound it.",
            difficulty: "Medium",
            topic: "Lateral Thinking",
            publishedAt: getPSTDate(new Date(Date.now() - 86400000 * 2)),
        }
    ];

    for (const c of challenges) {
        await prisma.challenge.upsert({
            where: { publishedAt: c.publishedAt },
            update: {},
            create: c,
        });
    }

    const badges = [
        { name: "First Spark", description: "Solved your first daily challenge", icon: "Zap" },
        { name: "Consistent Thinker", description: "Maintained a 3-day streak", icon: "Flame" },
        { name: "Grandmaster", description: "Solved 100 challenges", icon: "Trophy" },
    ];

    for (const b of badges) {
        await prisma.badge.upsert({
            where: { name: b.name },
            update: {},
            create: b,
        });
    }

    console.log("Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
