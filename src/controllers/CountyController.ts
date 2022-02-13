import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all Countries
export const getCountries = async (req: Request, res: Response) => {

    try {
        const countries = await prisma.country.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return res.json(countries);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};