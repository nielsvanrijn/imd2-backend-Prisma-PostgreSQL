import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a single Person
export const createPerson = async (req: Request, res: Response) => {
    const { firstName, lastName, birthday, countryId, bio, avatarUrl, directors, writers, characters, cast } = req.body;

    try {
        const person = await prisma.person.create({
            data: {
                firstName,
                lastName,
                birthday,
                countryId,
                bio,
                avatarUrl,
                director: {
                    createMany: {
                        skipDuplicates: true,
                        data: directors.map((movieId: number) => ({movieId}))
                    }
                },
                writer: {
                    createMany: {
                        skipDuplicates: true,
                        data: writers.map((movieId: number) => ({movieId}))
                    }
                },
                // character: {
                //     createMany: {
                //         skipDuplicates: true,
                //         data: characters.map((movieId: number) => ({movieId}))
                //     }
                // },
                cast: {
                    createMany: {
                        skipDuplicates: true,
                        data: cast.map((movieId: number) => ({movieId}))
                    }
                }
            }
        });
        
        return res.json(person);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Get all Persons
export const getPersons = async (req: Request, res: Response) => {

    try {
        const persons = await prisma.person.findMany({
            include: {
                country: true,
                director: true,
                writer: true,
                // character: true,
                cast: true,
            }
        });
        return res.json(persons);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Get a single Person
export const getPerson = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const person = await prisma.person.findUnique({
            where: { id: Number(id) },
            include: {
                country: true,
                director: true,
                writer: true,
                // character: true,
                cast: true,
            }
        });

        if (!person) {
            return res.status(404).send('Not Found');
        }

        return res.json(person);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Update a single Person
export const updatePerson = async (req: Request, res: Response) => {
    const { firstName, lastName, birthday, countryId, bio, avatarUrl, directors, writers, characters, cast } = req.body;
    const { id } = req.params;

    try {
        const person = await prisma.person.update({
            where: {
                id: +id
            },
            data: {
                firstName,
                lastName,
                birthday,
                countryId,
                bio,
                avatarUrl,
                director: {
                    createMany: {
                        skipDuplicates: true,
                        data: directors.map((movieId: number) => ({movieId}))
                    }
                },
                writer: {
                    createMany: {
                        skipDuplicates: true,
                        data: writers.map((movieId: number) => ({movieId}))
                    }
                },
                // character: {
                //     createMany: {
                //         skipDuplicates: true,
                //         data: characters.map((movieId: number) => ({movieId}))
                //     }
                // },
                cast: {
                    createMany: {
                        skipDuplicates: true,
                        data: cast.map((movieId: number) => ({movieId}))
                    }
                }
            }
        });
        
        return res.json(person);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Delete a single Person
export const deletePerson = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.person.delete({
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