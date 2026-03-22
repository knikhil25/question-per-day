import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import path from "path";

const prismaClientSingleton = () => {
    const databaseUrl = process.env.DATABASE_URL;

    // Local SQLite fallback or Turso/LibSQL
    if (!databaseUrl || databaseUrl.startsWith("file:") || databaseUrl.startsWith("libsql:")) {
        const url = databaseUrl || `file:${path.join(process.cwd(), "dev.db")}`;
        const adapter = new PrismaLibSql({ url });
        return new PrismaClient({ adapter });
    }

    // PostgreSQL fallback
    if (databaseUrl.startsWith("postgres") || databaseUrl.startsWith("postgresql")) {
        const pool = new Pool({ connectionString: databaseUrl });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    }

    // Default to standard Prisma (no adapter) for other providers (or if DATABASE_URL is not provided)
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
