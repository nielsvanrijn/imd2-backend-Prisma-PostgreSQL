import { hash } from "bcryptjs";

import { Role } from "@prisma/client";

export const users = async () => [
    // {
    //     email: 'kellybatist@hotmail.com',
    //     password: await hash('Testing!', 12),
    //     role: Role.USER,
    //     profile: {
    //         create: {
    //             name: 'Kelly Batist',
    //             bio: 'Hi I am Kelly Batist!',
    //             avatarUrl: 'https://upload.nielsapps.com/uploads/domains/localhost/kelly.jpeg'
    //         }
    //     }
    // },
    {
        email: 'nielsvanrijn24@gmail.com',
        password: await hash('Testing!', 12),
        role: Role.USER,
        profile: {
            create: {
                name: 'Niels van Rijn',
                bio: 'Hi I am Niels!',
                avatarUrl: 'https://upload.nielsapps.com/uploads/domains/localhost/me2.png'
            }
        }
    }
];