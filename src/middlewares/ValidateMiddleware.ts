import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export const validate = (schemas?: ValidationChain[] ) => async (req: Request, res: Response, next: NextFunction) => {
    if (schemas) await Promise.all(schemas.map(async (schema) => await schema.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }

    const errors = result.array();
    let status = 422;
    if (errors.some((error) => error.param === 'authorization')) {
        status = 401;
    }
    console.log('validatoin err', status, JSON.stringify(errors));
    return res.status(status).json(errors);
};