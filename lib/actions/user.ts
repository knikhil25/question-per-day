"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const NICKNAME_COOKIE = "ds_nickname";

export async function getUserProfile() {
    const cookieStore = await cookies();
    const nickname = cookieStore.get(NICKNAME_COOKIE)?.value;

    if (!nickname) return null;

    let user = await prisma.user.findUnique({
        where: { nickname },
        include: {
            streak: true,
            submissions: {
                include: { challenge: true },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            badges: {
                include: { badge: true },
            },
        },
    });

    // If user exists in cookie but not in DB (e.g. DB reset), create them
    if (!user && nickname) {
        user = await prisma.user.create({
            data: {
                nickname,
                streak: { create: {} }
            },
            include: {
                streak: true,
                submissions: { include: { challenge: true } },
                badges: { include: { badge: true } },
            }
        });
    }

    return user;
}

export async function setNickname(newNickname: string, referralCode?: string) {
    const cookieStore = await cookies();
    const oldNickname = cookieStore.get(NICKNAME_COOKIE)?.value;

    if (oldNickname && oldNickname !== newNickname) {
        // Migration: Check if old user exists
        const oldUser = await prisma.user.findUnique({ where: { nickname: oldNickname } });

        if (oldUser) {
            // Check if new nickname is already taken
            const existingNewUser = await prisma.user.findUnique({ where: { nickname: newNickname } });

            if (existingNewUser && existingNewUser.id !== oldUser.id) {
                throw new Error("This nickname is already taken. Please choose another one.");
            } else if (!existingNewUser) {
                // RENAME: Old user becomes the new nickname, preserving all data
                await prisma.user.update({
                    where: { id: oldUser.id },
                    data: { nickname: newNickname }
                });
            }
            // If existingNewUser.id === oldUser.id, it's already their name, just continue
        }
    } else if (!oldNickname) {
        // Fresh creation: check if taken
        const existing = await prisma.user.findUnique({ where: { nickname: newNickname } });
        if (existing) {
            throw new Error("This nickname is already taken. Please choose another one.");
        }

        await prisma.user.create({
            data: {
                nickname: newNickname,
                referredBy: referralCode,
                streak: { create: {} }
            }
        });
    }

    cookieStore.set(NICKNAME_COOKIE, newNickname, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
    });

    revalidatePath("/");
    revalidatePath("/profile");
    return newNickname;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(NICKNAME_COOKIE);
}
