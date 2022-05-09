import { Request, Response } from 'express';

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a single Movie
// export const createMovie = async (req: Request<core.ParamsDictionary, any, MovieWithRelations>, res: Response) => {
export const createMovie = async (req: Request, res: Response) => {
    const { name, year, length, description, posterUrls, trailerUrls, directors = [], writers = [], cast = [], genres = []  } = req.body;

    try {
        const movie = await prisma.movie.create({
            data: {
                name, 
                year,
                length,
                description,
                posterUrls,
                trailerUrls,
                directors: {
                    createMany: {
                        skipDuplicates: true,
                        data: directors.map((director: any) => ({personId: director.id}))
                    }
                },
                writers: {
                    createMany: {
                        skipDuplicates: true,
                        data: writers.map((writer: any) => ({personId: writer.id}))
                    }
                },
                cast: {
                    createMany: {
                        skipDuplicates: true,
                        data: cast.map((castObj: any) => ({
                            personId: castObj.personId,
                            characterId: castObj.characterId,
                        }))
                    }
                },
                genres: {
                    createMany: {
                        skipDuplicates: true,
                        data: genres.map((genre: any) => ({genreId: genre.id}))
                    }
                }
            }
        });
        
        return res.json(movie);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};


// Get all Movies
export const getMovies = async (req: Request, res: Response) => {

    try {
        const movies = await prisma.movie.findMany({
            include: {
                directors: true,
                writers: true,
                cast: true,
                genres: true,
            }
        });
        return res.json(movies);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Get all Movies with Sort and Filter
export const getMoviesWithSortAndFilter = async (req: Request, res: Response) => {
    const { sort = {on: 'name'}, filter = {} } = req.body;
	
    // remove empty arrays from filter
    Object.keys(filter).forEach((k) => filter[k].length === 0 && delete filter[k]);

    try {
        const movies = await prisma.movie.findMany({
            where: {
                genres: filter.genres ? {
                    some: {
                        genreId: { in: filter.genres.map((f: any) => f.id) },
                    }
                } : {},
                cast: filter.castPersons ? {
                    some: {
                        personId: { in: filter.castPersons.map((f: any) => f.id) },
                    }
                } : {},
                directors: filter.directorPersons ? {
                    some: {
                        personId: { in: filter.directorPersons.map((f: any) => f.id) },
                    }
                } : {},
                writers: filter.writerPersons ? {
                    some: {
                        personId: { in: filter.writerPersons.map((f: any) => f.id) },
                    }
                } : {},
            },
            include: {
                directors: true,
                writers: true,
                cast: true,
                genres: true,
            },
            orderBy: {
                [sort.on]: sort.direction
            }
        });
        return res.json(movies);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Get a single Movie
export const getMovie = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const movie = await prisma.movie.findUnique({
            where: { id: Number(id) },
            include: {
                directors: {
                    select: {
                        person: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
                writers: {
                    select: {
                        person: {
                            select: {
                                id: true,
                            }
                        }
                    }	
                },
                cast: {
                    select: {
                        characterId: true,
                        character: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                birthday: true,
                                bio: true,
                            }
                        },
                        movieId: true,
                        personId: true,
                        person: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            }
                        }
                    }
                },
                genres: {
                    select: {
                        genre: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
            }
        });

        if (!movie) {
            return res.status(404).send('Not Found');
        }

        return res.json(movie);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Update a single Movie
export const updateMovie = async (req: Request, res: Response) => {
    const { name, year, length, description, posterUrls, posterUrlsIndex = 0, trailerUrls, directors = [], writers = [], cast = [], genres = [] } = req.body;
    const { id } = req.params;

    try {
        const movie = await prisma.movie.update({
            where: {
                id: +id
            },
            include: {
                directors: {
                    select: {
                        person: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
                writers: {
                    select: {
                        person: {
                            select: {
                                id: true,
                            }
                        }
                    }	
                },
                cast: {
                    select: {
                        characterId: true,
                        character: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                birthday: true,
                                bio: true,
                            }
                        },
                        movieId: true,
                        personId: true,
                        person: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            }
                        }
                    }
                },
                genres: {
                    select: {
                        genre: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
            },
            data: {
                name,
                year,
                length,
                description,
                posterUrls,
                posterUrlsIndex,
                trailerUrls,
                directors: {
                    deleteMany: {
                        movieId: +id,
                        NOT: directors.map((director: any) => ({ personId: director.id })),
                    },
                    upsert: directors.map((director: any) => ({
                        where: {
                            movieId_personId: {
                                movieId: +id,
                                personId: director.id,
                            }
                        },
                        update: {
                            personId: director.id,
                        },
                        create: {
                            personId: director.id,
                        }
                    })),
                },
                writers: {
                    deleteMany: {
                        movieId: +id,
                        NOT: writers.map((writer: any) => ({ personId: writer.id })),
                    },
                    upsert: writers.map((writer: any) => ({
                        where: {
                            movieId_personId: {
                                movieId: +id,
                                personId: writer.id,
                            }
                        },
                        update: {
                            personId: writer.id,
                        },
                        create: {
                            personId: writer.id,
                        }
                    })),
                },
                cast: {
                    deleteMany: {
                        movieId: +id,
                        NOT: cast.map((castObj: any) => ({ personId: castObj.personId })),
                    },
                    upsert: cast.map((castObj: any) => ({
                        where: {
                            movieId_personId: {
                                movieId: castObj.movieId,
                                personId: castObj.personId
                            }
                        },
                        update: {
                            personId: castObj.personId,
                            // person: castObj.person,
                            characterId: castObj.characterId,
                            // character: castObj.character,
                        },
                        create: {
                            personId: castObj.personId,
                            // person: castObj.person,
                            characterId: castObj.characterId,
                            // character: castObj.character,
                        }
                    })),
                },
                genres: {
                    deleteMany: {
                        movieId: +id,
                        NOT: genres.map((genre: any) => ({ genreId: genre.id })),
                    },
                    upsert: genres.map((genre: any) => ({
                        where: {
                            movieId_genreId: {
                                movieId: +id,
                                genreId: genre.id,
                            }
                        },
                        update: {
                            genreId: genre.id,
                        },
                        create: {
                            genreId: genre.id,
                        }
                    })),
                }
            }
        });
        
        return res.json(movie);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Delete a single Movie
export const deleteMovie = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.movie.delete({
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


// Test
// export const test = async (req: Request, res: Response) => {
//     try {
//         const movie = await prisma.movie.findUnique<Prisma.MovieFindUniqueArgs>({
//             where: {
//                 id: 1
//             },
//             include: {
//                 directors: true,
//                 writers: true,
//                 cast: {
//                     select: {
//                         person: {
//                             select: {
//                                 firstName: true,
//                                 lastName: true,
//                             }
//                         },
//                         character: {
//                             select: {
//                                 firstName: true,
//                                 lastName: true,
//                             }
//                         }
//                     }
//                 },
//                 genres: {
//                     select: {
//                         genre: {
//                             select: {
//                                 name: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });
    
//         return res.json(movie);
//     } catch(e) {
//         console.log(e);
//         return res.status(500).send({ ok: false});
//     }
// };

export const test = async (req: Request, res: Response) => {

    console.log('Test');

    const bool = false;
    
    try {
        const movies = await prisma.movie.findMany({
            where: {
                genres: {
                    some: {
                        genreId: { in: [9] },
                    }
                },
                cast: bool ? {
                    some: {
                        personId: { in: undefined },
                    }
                } : {},
                // cast: {
                //     some: {
                //         personId: { in: undefined },
                //     }
                // },
                directors: {
                    some: {
                        personId: { in: undefined },
                    }
                },
                writers: {
                    some: {
                        personId: { in: undefined },
                    }
                },
            },
            include: {
                directors: true,
                writers: true,
                cast: true,
                genres: true,
            },
        });
        return res.json(movies);
    } catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};