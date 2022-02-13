export const movies = [
    {
        id: 1,
        name: 'No Time to Die',
        year: 2021,
        length: 163,
        description: 'James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.',
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/notimetodie.jpg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 27}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 27}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 27, characterId: 1}],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 13}]
            }
        },
    },
    {
        id: 2,
        name: `Harry Potter and the Philosopher's Stone`,
        year: 2001,
        length: 152,
        description: `Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard—with a place waiting for him at the Hogwarts School of Witchcraft and Wizardry. As he learns to harness his newfound powers with the help of the school's kindly headmaster, Harry uncovers the truth about his parents' deaths—and about the villain who's to blame.`,
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/hp1c.jpeg', 'https://upload.nielsapps.com/uploads/domains/localhost/hp1b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
    {
        id: 3,
        name: `Harry Potter and the Chamber of Secrets`,
        year: 2002,
        length: 161,
        description: `An ancient prophecy seems to be coming true when a mysterious presence begins stalking the corridors of a school of magic and leaving its victims paralyzed.`,
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/hp2.jpeg', 'https://upload.nielsapps.com/uploads/domains/localhost/hp2b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
    {
        id: 4,
        name: `Harry Potter and the Prisoner of Azkaban`,
        year: 2004,
        length: 142,
        description: `Harry Potter, Ron and Hermione return to Hogwarts School of Witchcraft and Wizardry for their third year of study, where they delve into the mystery surrounding an escaped prisoner who poses a dangerous threat to the young wizard.`,
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/hp3b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
    {
        id: 5,
        name: `Harry Potter and the Goblet of Fire`,
        year: 2005,
        length: 157,
        description: `Harry Potter finds himself competing in a hazardous tournament between rival schools of magic, but he is distracted by recurring nightmares.`,
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/hp4.jpeg', 'https://upload.nielsapps.com/uploads/domains/localhost/hp4b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
    {
        id: 6,
        name: `Harry Potter and the Order of the Phoenix`,
        year: 2007,
        length: 138,
        description: `With their warning about Lord Voldemort's return scoffed at, Harry and Dumbledore are targeted by the Wizard authorities as an authoritarian bureaucrat slowly seizes power at Hogwarts.`,
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/hp5b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
    {
        id: 7,
        name: `Harry Potter and the Half-Blood Prince`,
        year: 2009,
        length: 153,
        description: `As Harry Potter begins his sixth year at Hogwarts, he discovers an old book marked as "the property of the Half-Blood Prince" and begins to learn more about Lord Voldemort's dark past.`,
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/hp6b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
    {
        id: 8,
        name: `Harry Potter and the Deathly Hallows: Part 1`,
        year: 2010,
        length: 146,
        description: `As Harry, Ron, and Hermione race against time and evil to destroy the Horcruxes, they uncover the existence of the three most powerful objects in the wizarding world: the Deathly Hallows.`,
        posterUrls: ['https://upload.nielsapps.com/uploads/domains/localhost/hp7.png', 'https://upload.nielsapps.com/uploads/domains/localhost/hp7b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
    {
        id: 9,
        name: `Harry Potter and the Deathly Hallows: Part 2`,
        year: 2011,
        length: 130,
        description: `Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.`,
        posterUrls: ['https://www.themoviedb.org/t/p/original/c54HpQmuwXjHq2C9wmoACjxoom3.jpg', 'https://upload.nielsapps.com/uploads/domains/localhost/hp8b.jpeg'],
        directors: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        writers: {
            createMany: {
                skipDuplicates: true,
                data: [{personId: 48}],
            }
        },
        cast: {
            createMany: {
                skipDuplicates: true,
                data: [
                    { personId: 8, characterId: 2 },
                    { personId: 49, characterId: 3 },
                    { personId: 50, characterId: 4 }
                ],
            }
        },
        genres: {
            createMany: {
                skipDuplicates: true,
                data: [{genreId: 1}, {genreId: 2}, {genreId: 5}]
            }
        },
    },
];