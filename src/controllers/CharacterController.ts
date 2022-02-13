import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a single Character
export const createCharacter = async (req: Request, res: Response) => {
    const { firstName, lastName, birthday, bio, cast, persons } = req.body;

    try {
        const character = await prisma.character.create({
            data: {
                firstName,
                lastName,
                birthday,
                bio,
                cast: {
                    createMany: {
                        skipDuplicates: true,
                        data: cast.map((personId: number) => ({personId}))
                    }
                },
                // persons: {
                //     createMany: {
                //         skipDuplicates: true,
                //         data: persons.map((personId: number) => ({personId}))
                //     }
                // }
            }
        });
        
        return res.json(character);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Get all Characters
export const getCharacters = async (req: Request, res: Response) => {

    try {
        const characters = await prisma.character.findMany({
            include: {
                cast: true,
                // persons: true,
            }
        });
        return res.json(characters);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Get a single Characters
export const getCharacter = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const character = await prisma.character.findUnique({
            where: { id: Number(id) },
            include: {
                cast: true,
                // persons: true,
            }
        });

        if (!character) {
            return res.status(404).send('Not Found');
        }

        return res.json(character);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Create a single Character
export const updateCharacter = async (req: Request, res: Response) => {
    const { firstName, lastName, birthday, bio, cast, persons } = req.body;
    const { id } = req.params;

    try {
        const character = await prisma.character.update({
            where: {
                id: +id
            },
            data: {
                firstName,
                lastName,
                birthday,
                bio,
                cast: {
                    createMany: {
                        skipDuplicates: true,
                        data: cast.map((personId: number) => ({personId}))
                    }
                },
                // persons: {
                //     createMany: {
                //         skipDuplicates: true,
                //         data: persons.map((personId: number) => ({personId}))
                //     }
                // }
            }
        });
        
        return res.json(character);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Delete a single Character
export const deleteCharacter = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.character.delete({
            where: {
                id: +id
            }
        });
    
        return res.json({ ok: true });
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};