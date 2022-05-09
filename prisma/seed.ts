import { PrismaClient } from '@prisma/client';

import { characters } from './seeds/characters';
import { countries } from './seeds/countries';
import { genres } from './seeds/genres';
import { movies } from './seeds/movies';
import { persons } from './seeds/persons';
import { users } from './seeds/users';

const prisma = new PrismaClient();

async function main() {
    // Countries

    const firstCountry = await prisma.country.findFirst({
        where: {
            name: countries.shift()
        }
    });
    const lastCountry = await prisma.country.findFirst({
        where: {
            name: countries.pop()
        }
    });
    if (!firstCountry && !lastCountry) {
        await prisma.country.createMany({
            skipDuplicates: true,
            data: countries.map((country) => ({name: country}))
        });
    }

    // Genres
    const firstGenre = await prisma.genre.findFirst({
        where: {
            name: genres.shift()
        }
    });
    const lastGenre = await prisma.genre.findFirst({
        where: {
            name: genres.pop()
        }
    });
    if (!firstGenre && !lastGenre) {
        await prisma.genre.createMany({
            skipDuplicates: true,
            data: genres.map((genre) => ({name: genre}))
        });
    }
	
    // Users
    (await users()).forEach(async (user) => {
        await prisma.user.upsert({
            where: {
                email: user.email
            },
            update: {},
            create: user
        });
    });

    // Persons
    const firstPerson = await prisma.person.findFirst({
        where: {
            firstName: persons.shift()?.firstName,
            lastName: persons.shift()?.lastName
        }
    });
    const lastPerson = await prisma.person.findFirst({
        where: {
            firstName: persons.pop()?.firstName,
            lastName: persons.pop()?.lastName
        }
    });
    if (!firstPerson && !lastPerson) {
        for (const person of persons) {
            await prisma.person.create({
                data: person
            });
        }
    }
    // persons.forEach(async (person) => {
    //     await prisma.person.create({
    //         data: person
    //     });
    // });

    // Characters
    const firstCharacter = await prisma.character.findFirst({
        where: {
            firstName: characters.shift()?.firstName,
            lastName: characters.shift()?.lastName
        }
    });
    const lastCharacter = await prisma.character.findFirst({
        where: {
            firstName: characters.pop()?.firstName,
            lastName: characters.pop()?.lastName
        }
    });
    if (!firstCharacter && !lastCharacter) {
        characters.forEach(async (character) => {
            await prisma.character.create({
                data: character
            });
        });
    }

    // Movies
    const firstMovie = await prisma.movie.findFirst({
        where: {
            name: movies.shift()?.name,
            year: movies.shift()?.year
        }
    });
    const lastMovie = await prisma.movie.findFirst({
        where: {
            name: movies.pop()?.name,
            year: movies.pop()?.year
        }
    });
    if (!firstMovie && !lastMovie) {
        movies.forEach(async (movie) => {
            await prisma.movie.create({
                data: movie
            });
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });