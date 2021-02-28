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
    password2: string;
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

export const LOGIN_USER = 'user/login';
export type LOGIN_USER = typeof LOGIN_USER;
export const LOGIN_USER_SUCCESS = 'user/login-success';
export type LOGIN_USER_SUCCESS = typeof LOGIN_USER_SUCCESS;
export const LOGIN_USER_FAILED = 'user/login-failed';
export type LOGIN_USER_FAILED = typeof LOGIN_USER_FAILED;
export const REGISTER_USER = 'user/register';
export type REGISTER_USER = typeof REGISTER_USER;
export const REGISTER_USER_SUCCESS = 'user/register-success';
export type REGISTER_USER_SUCCESS = typeof REGISTER_USER_SUCCESS;
export const REGISTER_USER_FAILED = 'user/register-failed';
export type REGISTER_USER_FAILED = typeof REGISTER_USER_FAILED;

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
