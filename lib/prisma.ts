"use server";

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export async function getAllPhotographers() {
    return prisma.photographer.findMany();
}

export async function getPhotographerById(photographerId: number) {
    return prisma.photographer.findUnique({ where: { id: photographerId } });
}

export async function getPhotographerMedias(photographerId: number) {
    return prisma.media.findMany({ where: { photographerId: photographerId } });
}

export async function incrementMediaLike(mediaId: number) {
    return prisma.media.update({
        where: { id: mediaId },
        data: { likes: { increment: 1 } },
    });
}
