import { verify } from "jsonwebtoken";
import { header } from "express-validator";

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Check access token
export const isAuth = [
    header('authorization', 'Authorization header not set')
        .notEmpty().withMessage('Authorization must not be empty').bail()
        .custom(async (value) => {
            if (!value) return true;
            try {
                const token = value.split(' ')[1];
                verify(token, <string>process.env.JWT_ACCESS_SECRET);
                return await Promise.resolve();
            }
            catch(err: any) {
                console.log('auth err', JSON.stringify(err));
                return await Promise.reject(new Error(err.message ? err.message : 'Invalid Token'));
            }
        })
];

export const isAdmin = [
    header('authorization', 'Authorization header not set')
        .notEmpty().withMessage('Authorization must not be empty').bail()
        .custom(async (value) => {
            if (!value) return true;
            try {
                const token = value.split(' ')[1];
                const decoded: any = verify(token, <string>process.env.JWT_ACCESS_SECRET);

                const admin = await prisma.user.findUnique({
                    where: { id: Number(decoded.userId) }
                });

                if (!admin) return await Promise.reject(new Error('Validation failed'));

                if (admin.role !== Role.ADMIN) return await Promise.reject(new Error('No permissions'));
                return await Promise.resolve();
            }
            catch(err: any) {
                console.log('auth err', JSON.stringify(err));
                return await Promise.reject(new Error(err.message ? err.message : 'Invalid Token'));
            }
        })
];