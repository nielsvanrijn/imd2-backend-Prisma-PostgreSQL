import { compare } from 'bcryptjs';
import { body, param } from 'express-validator';
import { verify } from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Documentation reminder
// .body('email', 'Email is required') checks if "email" exists
// .notEmpty().withMessage('Email is required') checks if "email" is not empty
// .bail() stops on the validation and does not validate further rules

// Create User / register
export const createUserSchema = [
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
    body('password', 'Password is required')
        .notEmpty().withMessage('Password must not be empty').bail()
        .isLength({min: 6}).withMessage('Password must be longer than 6 characters')
        .matches(/[A-Z]/).withMessage('Password does not contain an uppercase character')
        .matches(/\W/).withMessage('Password does not contain any non-word characters')
];

// Update
export const updateUserSchema = [
    body('email', 'Email is required')
        .notEmpty().withMessage('Email must not be empty').bail()
        .isEmail().withMessage('Email is not valid').bail()
        .custom(async (value, meta) => {
            if (!value || !meta.req.headers || !meta.req.headers['authorization']) return true;
            const token = meta.req.headers['authorization'].split(' ')[1];
            const decoded: any = verify(token, <string>process.env.JWT_ACCESS_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: Number(decoded.userId) },
            });
            if (!user) return true;
            // if the body.email different then the current email => check if body.email is not already in use
            if (!user.email === value) {
                return prisma.user
                    .findUnique({
                        where: {
                            email: value
                        }
                    })
                    .then(async (userWithTakenEmail) => {
                        if (userWithTakenEmail) {
                            return await Promise.reject(new Error('E-mail already in use'));
                        }
                        return await Promise.resolve();
                    });
            } else {
                // if body.email is the same allow
                return await Promise.resolve();
            }
        }),
    body('profile', 'Profile is required')
        .notEmpty().withMessage('Profile must not be empty').bail()
        .isObject().withMessage('Profile must be an object').bail(),
    body('profile.name', 'Profile has to have an "name" property'),
    body('profile.bio', 'Profile has to have an "bio" property'),
    body('profile.avatar_url', 'Profile has to have an "avatar_url" property')
];

// Delete user
export const deleteUserSchema = [
    param('id', 'id is required')
        .notEmpty().withMessage('id must not be empty').bail()
        .isNumeric().withMessage('id must be numeric').bail()
        .custom(async (value, meta) => {
            if (!value || !meta.req.headers || !meta.req.headers['authorization']) return true;
            const token = meta.req.headers['authorization'].split(' ')[1];
            const decoded: any = verify(token, <string>process.env.JWT_ACCESS_SECRET);
            // if the param.id is the same as the to-be-deleted-user id => don't allow admins to delete themselves
            if (Number(decoded.userId) === value) {
                return await Promise.reject(new Error('You can not delete yourself, ask a different admin!'));
            } else {
                // if the param.id is different as the to-be-deleted-user id => allow admins to delete other admins
                return await Promise.resolve();
            }
        }),

];

// Login
export const loginUserSchema = [
    body('email', 'Email is required')
        .notEmpty().withMessage('Email must not be empty').bail()
        .isEmail().withMessage('Email is not valid').bail()
        .custom(async (value) => {
            if (!value) return true;
            const user = await prisma.user
                .findUnique({
                    where: {
                        email: value
                    }
                });
                
            if (!user) return await Promise.reject(new Error('No users found with that E-mail'));
            return await Promise.resolve();
        }),
    body('password', 'Password is required')
        .notEmpty().withMessage('Password must not be empty').bail()
        .custom(async (value, meta) => {
            if (!value) return true;
            const user = await prisma.user
                .findUnique({
                    where: {
                        email: meta.req.body.email
                    }
                });
            if (!user) return true;

            const valid = await compare(value, user.password);
            if (!valid) return await Promise.reject(new Error('Invalid E-mail password combination'));
            return await Promise.resolve();
        })
];

// revoke refeshToken for user
export const revokeUserRefeshTokenSchema = [
    body('email', 'Email is required')
        .notEmpty().withMessage('Email must not be empty').bail()
        .isEmail().withMessage('Email is not valid').bail()
        .custom(async (value) => {
            if (!value) return true;
            const user = await prisma.user
                .findUnique({
                    where: {
                        email: value
                    }
                });
                
            if (!user) return await Promise.reject(new Error('No users found with that E-mail'));
            return await Promise.resolve();
        }),
];