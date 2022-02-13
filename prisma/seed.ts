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
    await prisma.country.createMany({
        skipDuplicates: true,
        data: countries.map((country) => ({name: country}))
    });

    // Genres
    await prisma.genre.createMany({
        skipDuplicates: true,
        data: genres.map((genre) => ({name: genre}))
    });
	
    // Users
    (await users()).forEach(async (user) => {
        await prisma.user.create({
            data: user
        });
    });

    // Persons
    for (const person of persons) {
        await prisma.person.create({
            data: person
        });
    }
    // persons.forEach(async (person) => {
    //     await prisma.person.create({
    //         data: person
    //     });
    // });

    // Characters
    characters.forEach(async (character) => {
        await prisma.character.create({
            data: character
        });
    });

    // Movies
    movies.forEach(async (movie) => {
        await prisma.movie.create({
            data: movie
        });
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });