import { body, oneOf, param } from 'express-validator';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a single Person
export const createPersonSchema = [
    body('firstName', 'firstName is required')
        .notEmpty().withMessage('firstName must not be empty')
        .isString().withMessage('firstName must a string'),
    body('lastName', 'lastName is required')
        .notEmpty().withMessage('lastName must not be empty')
        .isString().withMessage('lastName must a string'),
    body('birthday', 'birthday is required')
        .notEmpty().withMessage('birthday must not be empty')
        .isDate().withMessage('birthday must be an date'),
    body('countryId', 'countryId is required')
        .notEmpty().withMessage('countryId must not be empty')
        .isNumeric().withMessage('countryId must be numeric')
        .custom(async (value) => {
            if (!value) return true;
            const country = await prisma.country
                .findUnique({
                    where: {
                        id: value
                    }
                });
                
            if (!country) return await Promise.reject(new Error('No counties found with that id'));
            return await Promise.resolve();
        }),
    body('bio', 'biography is required')
        .notEmpty().withMessage('biography must not be empty')
        .isString().withMessage('biography must a string'),
    body('avatarUrl', 'avatarUrl is required')
        .notEmpty().withMessage('avatarUrl must not be empty')
        .isString().withMessage('avatarUrl must a string'),
    body('directors')
        .isArray().withMessage('directors must be an array'),
    body('directors.*')
        .isNumeric().withMessage('directors array must contain only numberics'),
    body('writers')
        .isArray().withMessage('writers must be an array'),
    body('writers.*')
        .isNumeric().withMessage('writers array must contain only numberics'),
    body('characters')
        .isArray().withMessage('characters must be an array'),
    body('characters.*')
        .isNumeric().withMessage('characters array must contain only numberics'),
    body('cast')
        .isArray().withMessage('cast must be an array'),
    body('cast.*')
        .isNumeric().withMessage('cast array must contain only numberics'),
];

// Get a single Person
export const getPersonSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric'),
];

// Update a single Person
export const updatePersonSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric').bail(),
    oneOf([
        body('firstName', 'firstName is required')
            .notEmpty().withMessage('firstName must not be empty')
            .isString().withMessage('firstName must a string'),
        body('lastName', 'lastName is required')
            .notEmpty().withMessage('lastName must not be empty')
            .isString().withMessage('lastName must a string'),
        body('birthday', 'birthday is required')
            .notEmpty().withMessage('birthday must not be empty')
            .isDate().withMessage('birthday must be an date'),
        body('countryId', 'countryId is required')
            .notEmpty().withMessage('countryId must not be empty')
            .isNumeric().withMessage('countryId must be numeric')
            .custom(async (value) => {
                if (!value) return true;
                const country = await prisma.country
                    .findUnique({
                        where: {
                            id: value
                        }
                    });
                
                if (!country) return await Promise.reject(new Error('No counties found with that id'));
                return await Promise.resolve();
            }),
        body('bio', 'biography is required')
            .notEmpty().withMessage('biography must not be empty')
            .isString().withMessage('biography must a string'),
        body('avatarUrl', 'avatarUrl is required')
            .notEmpty().withMessage('avatarUrl must not be empty')
            .isString().withMessage('avatarUrl must a string'),
        body('directors')
            .isArray().withMessage('directors must be an array'),
        body('writers')
            .isArray().withMessage('writers must be an array'),
        body('characters')
            .isArray().withMessage('characters must be an array'),
        body('cast')
            .isArray().withMessage('cast must be an array'),
    ], 'Must update at least one field'),
    body('directors.*')
        .isNumeric().withMessage('directors array must contain only numberics'),
    body('writers.*')
        .isNumeric().withMessage('writers array must contain only numberics'),
    body('characters.*')
        .isNumeric().withMessage('characters array must contain only numberics'),
    body('cast.*')
        .isNumeric().withMessage('cast array must contain only numberics'),
];

// Delete a single Person 
export const deletePersonSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric').bail(),
];