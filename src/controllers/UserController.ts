import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create User / register
export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const hashedPassword = await hash(password, 12);
    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                profile: {
                    create: {
                        name
                    }
                }
            }
        });

        return res.status(200).send({ ok: true });
    }
    catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false});
    }
};

// Read User
export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    return res.json(users);
};
export const getUser = async (req: Request, res: Response) => {
    const decoded = authValidationCheck(req, res, 'getUser');

    const user = await prisma.user.findUnique({
        where: { id: Number(decoded.userId) },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            profile: {
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    avatarUrl: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        },
    });

    return res.json(user);
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
    const decoded = authValidationCheck(req, res, 'updateUser');

    try {
        const { email, profile: {name, bio, avatarUrl} } = req.body;

        const user = await prisma.user.update({
            where: { id: Number(decoded.userId) },
            data: {
                email,
                profile: {
                    update: {
                        name,
                        bio,
                        avatarUrl
                    }
                }
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                profile: {
                    select: {
                        id: true,
                        name: true,
                        bio: true,
                        avatarUrl: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            },
        });

        return res.json(user);
    }
    catch (err) {
        return res.status(500).json(err);
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.profile.delete({
            where: {
                userId: Number(id)
            }
        });
        await prisma.user.delete({
            where: {
                id: Number(id)
            }
        });

        return res.json({ ok: true });
    } catch (err) {
        return res.status(500).json(err);
    }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) return res.status(500).json('Validation failed');

    res.cookie(
        'rt',
        sign({userId: user.id, tokenVersion: user.tokenVersion}, <string>process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'}),
        {httpOnly: true}
    );
    
    return res.status(200).json({
        accessToken: sign({userId: user.id}, <string>process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
    });
};

// Refesh token
export const refeshToken = async (req: Request, res: Response) => {
    const token = req.cookies.rt;
    if (!token) {
        return res.status(400).send({ok: false, accessToken: ''});
    }

    let payload: any = null;
    try {
        payload = verify(token, <string>process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ok: false, accessToken: ''});
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    });

    if (!user) return res.status(500).send({ok: false, accessToken: ''});
	
    if (user.tokenVersion !== payload.tokenVersion) return res.status(400).send({ok: false, accessToken: ''});

    res.cookie(
        'rt',
        sign({userId: user.id, tokenVersion: user.tokenVersion}, <string>process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'}),
        {httpOnly: true}
    );

    return res.status(200).json({
        ok: true,
        accessToken: sign({userId: user.id}, <string>process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
    });
};

// Logout
export const logout = async (req: Request, res: Response) => {
    res.cookie(
        'rt',
        '',
        {httpOnly: true}
    );

    return res.status(200).send({ ok: true });
};

// Revoke token
export const revokeUserRefeshToken = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) return res.status(500).json('Validation failed');

    try {
        await prisma.user.update({
            where: { email },
            data: { tokenVersion: user.tokenVersion + 1 },
        });

        return res.status(200).send({ ok: true });
    }
    catch(err: any) {
        console.log(err);
        return res.status(500).send(err.message ? err.message : 'Could not update user');
    }
};

function authValidationCheck(req: Request, res: Response, functionName = ''): any {
    if (!(req.headers && req.headers.authorization)) return res.status(500).json(`${functionName} Validation failed`);
    
    let decoded: any;
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        decoded = verify(token, <string>process.env.JWT_ACCESS_SECRET);

        return decoded;
    }
    catch(err) {
        return res.status(500).json(err);
    }
}