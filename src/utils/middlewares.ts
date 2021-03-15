/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NextFunction, Request, Response } from 'express';
import {
    BAD_REQUEST,
    getStatusText,
    INTERNAL_SERVER_ERROR,
    UNAUTHORIZED,
} from 'http-status-codes';
import { AuthRequest, FailedResponse } from '../types';
import { logger } from './logger';
import { apiResponse, failedResponse } from './response';
import {
    removeEmpty,
    validateCreateQuestion,
    validateLogin,
    validateUserRegistration,
} from './validator';

import { validateToken } from '../utils/passport';

export function logging(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    logger.error(err);
    next(err);
}

export function errorHandler(err: Error, req: Request, res: Response) {
    res.status(500).send({ error: err.message });
}

export function timeMiddleware(req: any, res: Response, next: NextFunction) {
    req.requestTime = Date.now();
    next();
}

export function validateRegister(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        req.body = removeEmpty(req.body);

        const valid = validateUserRegistration(req.body);

        if (valid.length > 0) {
            apiResponse<FailedResponse>(
                res,
                failedResponse(valid),
                BAD_REQUEST,
            );
        } else {
            next();
        }
    } catch (error) {
        apiResponse<FailedResponse>(
            res,
            failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
            INTERNAL_SERVER_ERROR,
        );
    }
}

export function validatingLogin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        req.body = removeEmpty(req.body);

        const valid = validateLogin(req.body);

        if (valid.length > 0) {
            apiResponse<FailedResponse>(
                res,
                failedResponse(valid),
                BAD_REQUEST,
            );
        } else {
            next();
        }
    } catch (error) {
        apiResponse<FailedResponse>(
            res,
            failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
            INTERNAL_SERVER_ERROR,
        );
    }
    return;
}

export function verifyUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    try {
        let token: string;
        if (!req.header('authorization')) {
            apiResponse<FailedResponse>(
                res,
                failedResponse(getStatusText(UNAUTHORIZED)),
                UNAUTHORIZED,
            );
        }
        const authHeader = req.header('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7, authHeader.length);
            req.user = validateToken(token);
        }
        next();
    } catch (error) {
        apiResponse<FailedResponse>(
            res,
            failedResponse(getStatusText(UNAUTHORIZED)),
            UNAUTHORIZED,
        );
    }
}

export function validateQuestionInput(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        req.body = removeEmpty(req.body);

        const valid = validateCreateQuestion(req.body);

        if (valid.length > 0) {
            apiResponse<FailedResponse>(
                res,
                failedResponse(valid),
                BAD_REQUEST,
            );
        } else {
            next();
        }
    } catch (error) {
        apiResponse<FailedResponse>(
            res,
            failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
            INTERNAL_SERVER_ERROR,
        );
    }
}
