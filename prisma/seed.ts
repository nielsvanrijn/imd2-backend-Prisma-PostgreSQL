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
        await prisma.user.upsert({
            where: {
                email: user.email
            },
            update: user,
            create: user
        });
    });

    // Persons
    // const firstPerson = await prisma.person.findFirst({
    //     where: {
    //         firstName: persons.shift()?.firstName,
    //         lastName: persons.shift()?.lastName
    //     }
    // });
    // const lastPerson = await prisma.person.findFirst({
    //     where: {
    //         firstName: persons.pop()?.firstName,
    //         lastName: persons.pop()?.lastName
    //     }
    // });
    // if (!firstPerson && !lastPerson) {
    // for (const person of persons) {
    //     await prisma.person.create({
    //         data: person
    //     });
    // }
    await prisma.person.createMany({
        skipDuplicates: true,
        data: persons.map((person) => ({
            firstName: person.firstName,
            lastName: person.lastName,
            birthday: person.birthday,
            countryId: person.country.connect.id,
            bio: person.bio,
            avatarUrl: person.avatarUrl
        }))
    });
    // }

    // Characters
    await prisma.character.createMany({
        skipDuplicates: true,
        data: characters.map((character) => ({
            firstName: character.firstName,
            lastName: character.lastName,
            birthday: character.birthday,
            bio: character.bio,
        }))
    });

    // Movies
    for (const movie of movies) {
        await prisma.movie.upsert({
            where: {
                name_year_length: {
                    name: movie.name,
                    year: movie.year,
                    length: movie.length
                }
            },
            update: movie,
            create: movie
        });
    }
    // await prisma.movie.createMany({
    //     skipDuplicates: true,
    //     data: movies.map((movie) => ({
    //         name: movie.name,
    //         year: movie.year,
    //         length: movie.length,
    //         description: movie.description,
    //         posterUrls: movie.posterUrls,
    //     }))
    // });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });