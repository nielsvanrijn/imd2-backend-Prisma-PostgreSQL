import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all Genres
export const getGenres = async (req: Request, res: Response) => {

    try {
        const genres = await prisma.genre.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return res.json(genres);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};