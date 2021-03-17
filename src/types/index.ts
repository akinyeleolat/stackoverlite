import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

export const applicationJson = 'application/json';
export const applicationXml = 'application/xml';
export const API = 'api';
export const POST = 'POST';
export const GET = 'GET';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const PATCH = 'PATCH';

export interface UserRegister {
    id?: number;
    email: string;
    password: string;
    password2?: string;
    firstName: string;
    middleName: string;
    lastName: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface JwtError {
    name: string;
    message: string;
    expireAt: Date;
}

export interface RequestSkillsTypes {
    idSkill: number;
}

export interface SuccessResponse<T = any> {
    success: true;
    data: T;
}

export interface FailedResponse<T = any> {
    success: false;
    data: T;
}

export interface RegisterCredentials {
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    password: string;
    password2: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AppRequest<B = any> extends Request {
    requestTime: number;
    body: B;
    success: boolean;
}

export interface ApiResult {
    data: any;
    code: number;
}

export interface EndPoint {
    (
        req: Request,
        res: Response,
        next: NextFunction,
        logger: winston.Logger,
    ): Promise<Response>;
}

export const EMAIL_EXISTS = 1;
export type EMAIL_EXISTS = typeof EMAIL_EXISTS;

export interface QuestionParams {
    id?: number;
    title: string;
    slug?: string;
    description?: string;
    text: string;
    userId?: number;
}

export interface AuthRequest extends Request {
    user?: string | object;
}

export enum AnswerStatus {
    pending,
    accepted,
}
export interface AnswerParams {
    id?: number;
    answer: string;
    userId: number;
    questionId: number;
    status?: string;
    updatedAt?: number;
}

export interface AnswerValue {
    id: number;
    answer: string;
    userId: number;
    questionId: number;
    status: string;
}
export interface UserCredentials {
    id: number;
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
}
