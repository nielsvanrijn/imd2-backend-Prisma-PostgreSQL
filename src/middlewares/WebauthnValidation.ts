import { compare } from 'bcryptjs';
import { body, param } from 'express-validator';
import { verify } from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Documentation reminder
// .body('email', 'Email is required') checks if "email" exists
// .notEmpty().withMessage('Email is required') checks if "email" is not empty
// .bail() stops on the validation and does not validate further rules

// WebauthN register initialize
export const registerInitializeSchema = [
    body('name', 'Name is required')
        .notEmpty().withMessage('Name must not be empty').bail(),
    body('email', 'Email is required')
        .notEmpty().withMessage('Email must not be empty').bail()
        .isEmail().withMessage('Email is not valid').bail()
        .custom((value) => {
            if (!value) return true;
            return prisma.user
                .findUnique({
                    where: {
                        email: value
                    }
                })
                .then(async (user) => {
                    if (user) {
                        console.log(JSON.stringify(user));
                        return await Promise.reject(new Error('E-mail already in use'));
                    }
                    return await Promise.resolve();
                });
        }),
];

// WebauthN register finalize
export const registerFinalizeSchema = [
    body('email', 'Email is required')
        .notEmpty().withMessage('Email must not be empty').bail(),
    body('attestation', 'Attestation is required')
        .notEmpty().withMessage('Attestation must not be empty').bail(),
];

// WebauthN login initialize
export const loginInitializeSchema = [
    body('email', 'Email is required')
        .notEmpty().withMessage('Email must not be empty').bail(),
];

// WebauthN login finalize
export const loginFinalizeSchema = [
    body('email', 'Email is required')
        .notEmpty().withMessage('Email must not be empty').bail(),
    body('attestation', 'Attestation is required')
        .notEmpty().withMessage('Attestation must not be empty').bail(),
];
