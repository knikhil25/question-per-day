import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prismaClientSingleton = () => {
    // Use absolute path to ensure Next.js finds the database file regardless of execution context
    const dbPath = `file:${path.join(process.cwd(), "dev.db")}`;

    const adapter = new PrismaLibSql({
        url: dbPath,
    });
    return new PrismaClient({ adapter });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
