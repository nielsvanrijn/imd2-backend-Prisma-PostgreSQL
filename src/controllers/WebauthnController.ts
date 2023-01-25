import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { PrismaClient } from '@prisma/client';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { AuthenticatorTransportFuture } from '@simplewebauthn/typescript-types';
import { isoUint8Array } from '@simplewebauthn/server/helpers';

const prisma = new PrismaClient();

const potentialUsersAndCredentialIds: { [key: string]: { name?: string, challenge: string } } = { 
    user: {
        name: '',
        challenge: ''
    }
};

// WebauthN register initialize
export const webauthnRegisterInitialize = async (req: Request, res: Response) => {
    const { name, email }: { name: string; email: string } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            credentials: true
        }
    });
    
    // get the max id from the database using prisma
    const maxId = (await prisma.user.findMany({
        orderBy: {
            id: 'desc'
        },
        take: 1
    }))[0].id;

    try {
        
        const options = generateRegistrationOptions({
            rpName: process.env.rpName ?? '',
            rpID: process.env.rpID ?? '',
            userID: user ? user.id.toString() : (maxId + 1).toString(),
            userName: email,
            userDisplayName: name,
            // Don't prompt users for additional information about the authenticator
            // (Recommended for smoother UX)
            attestationType: 'none',
            // Prevent users from re-registering existing authenticators
            excludeCredentials: user ? user.credentials.map(authenticator => ({
                id: base64StringToUint8Array(authenticator.credentialID),
                type: 'public-key',
                // Optional
                transports: authenticator.transports as AuthenticatorTransportFuture[],
            })) : [],
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'preferred',
            }
        });
          
        // Remember the challenge for this user
        potentialUsersAndCredentialIds[email] = {
            name: name,
            challenge: options.challenge
        };

        return res.json(options);
    }
    catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false });
    }
};

// WebauthN register finalize
export const webauthnRegisterFinalize = async (req: Request, res: Response) => {
    const { email, attestation } = req.body;

    try {
        const verification = await verifyRegistrationResponse({
            response: attestation,
            expectedChallenge: potentialUsersAndCredentialIds[email].challenge,
            expectedOrigin: process.env.origin ?? '',
            expectedRPID: process.env.rpID ?? '',
            requireUserVerification: true,
        });
        
        const { verified, registrationInfo } = verification;
        
        if (!verified) res.status(500).send({ ok: false });
        
        if (!registrationInfo) res.status(500).send({ ok: false });

        await prisma.authenticator.upsert({
            where: {
                credentialID: uint8ArrayToBase64String(registrationInfo!.credentialID)
            },
            create: {
                credentialID: uint8ArrayToBase64String(registrationInfo!.credentialID),
                credentialPublicKey: Buffer.from(registrationInfo!.credentialPublicKey),
                counter: registrationInfo!.counter,
                credentialDeviceType: registrationInfo!.credentialDeviceType,
                credentialBackedUp: registrationInfo!.credentialBackedUp,
                user: {
                    connectOrCreate: {
                        where: {
                            email: email
                        },
                        create: {
                            email: email,
                            profile: {
                                create: {
                                    name: potentialUsersAndCredentialIds[email].name!,
                                    avatarUrl: '',
                                }
                            }
                        }
                    }
                }
            },
            update: {
                credentialID: uint8ArrayToBase64String(registrationInfo!.credentialID),
                credentialPublicKey: Buffer.from(registrationInfo!.credentialPublicKey),
                counter: registrationInfo!.counter,
                credentialDeviceType: registrationInfo!.credentialDeviceType,
                credentialBackedUp: registrationInfo!.credentialBackedUp,
                user: {
                    connectOrCreate: {
                        where: {
                            email: email
                        },
                        create: {
                            email: email,
                            profile: {
                                create: {
                                    name: 'No Name',
                                    avatarUrl: '',
                                    bio: 'Write your bio here',
                                }
                            }
                        }
                    }
                }
            }
        });

        delete potentialUsersAndCredentialIds[email];
        
        return res.status(200).send({ ok: true });
    }
    catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false });
    }
};

// WebauthN login initialize
export const webauthnLoginInitialize = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            credentials: true
        }
    });

    try {
        const options = generateAuthenticationOptions({
            // Require users to use a previously-registered authenticator
            allowCredentials: user ? user.credentials.map(authenticator => ({
                id: base64StringToUint8Array(authenticator.credentialID),
                type: 'public-key',
                // Optional
                transports: authenticator.transports as AuthenticatorTransportFuture[],
            })) : [],
            userVerification: 'preferred',
        });

        // Remember the challenge for this user
        // potentialUserAndCredentialId.user = email;
        // potentialUserAndCredentialId.challenge = options.challenge;
        potentialUsersAndCredentialIds[email] = {
            challenge: options.challenge
        };

        return res.json(options);
    }
    catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false });
    }
};

// WebauthN login finalize
export const webauthnLoginFinalize = async (req: Request, res: Response) => {
    const { email, attestation } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                tokenVersion: true,
                credentials: {
                    where: {
                        credentialID: attestation.id
                    }
                }
            },
        });

        if (!user || !user.credentials) return res.status(500).send({ ok: false });
        
        const verification = await verifyAuthenticationResponse({
            response: attestation,
            expectedChallenge: potentialUsersAndCredentialIds[email].challenge,
            expectedOrigin: process.env.origin ?? '',
            expectedRPID: process.env.rpID ?? '',
            authenticator: {
                credentialID: base64StringToUint8Array(user!.credentials![0].credentialID),
                credentialPublicKey: user!.credentials![0].credentialPublicKey,
                counter: Number(user!.credentials![0].counter),
            },
            requireUserVerification: true,
        });

        const { verified, authenticationInfo } = verification;

        if (!verified) return res.status(500).send({ ok: false });

        if (!authenticationInfo) return res.status(500).send({ ok: false });

        const authenticatorUpdateCount = await prisma.authenticator.update({
            where: {
                credentialID: uint8ArrayToBase64String(authenticationInfo!.credentialID)
            },
            data: {
                counter: authenticationInfo!.newCounter
            }
        });


        if (!authenticatorUpdateCount) return res.status(500).send({ ok: false });

        delete potentialUsersAndCredentialIds[email];

        res.cookie(
            'rt',
            sign({userId: user!.id, tokenVersion: user!.tokenVersion}, <string>process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'}),
            {httpOnly: true}
        );
        
        return res.status(200).json({
            accessToken: sign({userId: user!.id}, <string>process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        });
    }
    catch(e) {
        console.log(e);
        return res.status(500).send({ ok: false });
    }
};

function uint8ArrayToBase64String(uint8Array: Uint8Array) {
    return Buffer.from(uint8Array).toString('base64url');
}

function base64StringToUint8Array(base64String: string) {
    return Buffer.from(base64String, 'base64url');
}
