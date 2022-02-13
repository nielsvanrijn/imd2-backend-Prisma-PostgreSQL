import { body, oneOf, param } from 'express-validator';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// id			Int			@id @default(autoincrement())
// firstName		String
// lastName		String
// birthday		DateTime
// bio			String
// cast			CastOnMovies[]
// persons		CharactersOnPersons[]
// createdAt		DateTime	@default(now())
// updatedAt		DateTime	@updatedAt

// Create a single Character
export const createCharacterSchema = [
    body('firstName', 'firstName is required')
        .notEmpty().withMessage('firstName must not be empty').bail()
        .isString().withMessage('firstName must a string'),
    body('lastName', 'lastName is required')
        .notEmpty().withMessage('lastName must not be empty').bail()
        .isString().withMessage('lastName must a string'),
    body('birthday', 'birthday is required')
        .notEmpty().withMessage('birthday must not be empty').bail()
        .isDate().withMessage('birthday must be an date'),
    body('bio', 'biography is required')
        .notEmpty().withMessage('biography must not be empty').bail()
        .isString().withMessage('biography must be a string'),
    body('cast')
        .isArray().withMessage('cast must be an array'),
    body('cast.*')
        .isNumeric().withMessage('cast array must contain only numberics'),
    body('persons')
        .isArray().withMessage('persons must be an array'),
    body('persons.*')
        .isNumeric().withMessage('persons array must contain only numberics'),
];

// Get a single Character
export const getCharacterSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric'),
];

// Update a single Character
export const updateCharacterSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric').bail(),
    oneOf([
        body('firstName', 'firstName is required')
            .notEmpty().withMessage('firstName must not be empty').bail()
            .isString().withMessage('firstName must a string'),
        body('lastName', 'lastName is required')
            .notEmpty().withMessage('lastName must not be empty').bail()
            .isString().withMessage('lastName must a string'),
        body('birthday', 'birthday is required')
            .notEmpty().withMessage('birthday must not be empty').bail()
            .isDate().withMessage('birthday must be an date'),
        body('bio', 'biography is required')
            .notEmpty().withMessage('biography must not be empty').bail()
            .isString().withMessage('biography must be a string'),
        body('cast')
            .isArray().withMessage('cast must be an array'),
        body('persons')
            .isArray().withMessage('persons must be an array'),
    ], 'Must update at least one field'),
    body('cast.*')
        .isNumeric().withMessage('cast array must contain only numberics'),
    body('persons.*')
        .isNumeric().withMessage('persons array must contain only numberics'),
];

export const deleteCharacterSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric').bail(),
];