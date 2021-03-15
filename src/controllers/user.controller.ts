/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { NextFunction, Request, Response } from 'express';
import {
    BAD_REQUEST,
    CREATED,
    getStatusText,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
} from 'http-status-codes';
import { UserRegister } from '../types';
import { UserService } from '../services';
import { encryptPassword, isEqualsPassword } from '../utils/encrypter';
import { createToken } from '../utils/passport';
import {
    apiResponse,
    failedResponse,
    successResponse,
} from '../utils/response';
import { logger } from '../utils/logger';

/**
 * @description User controller
 * @class
 * @public
 */
export class UserController {
    /**
     * @description Creates an instance of user controller.
     * @author `Tosin Akinyele`
     * @constructor
     * @param {UserService} userService
     */
    public constructor(private userService: UserService) {
        this.register = this.register.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * register a new user into the system
     * @Post
     * @async
     * @public
     * @method {register}
     * @memberof {UserController}
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const user = <UserRegister>req.body;
            logger.info('register');

            const isEmailAlready = await this.userService.getUserByEmail(
                user.email,
            );
            if (isEmailAlready !== null) {
                logger.error(
                    `the email ${isEmailAlready.email} already exists`,
                );
                return apiResponse(
                    res,
                    failedResponse('email already exists'),
                    BAD_REQUEST,
                );
            }

            user.password = await encryptPassword(user.password, 10);

            const stored = await this.userService.save(user);

            if (stored === null) {
                logger.error(`error while saving user with ${user.email}`);
                return apiResponse(
                    res,
                    failedResponse(
                        `error while saving user with ${user.email}`,
                    ),
                    BAD_REQUEST,
                );
            }

            const toSend = {
                id: stored.id,
                email: stored.email,
                firstName: stored.firstName,
                middleName: stored.middleName,
                lastName: stored.lastName,
            };

            const token = createToken(toSend);

            return apiResponse(
                res,
                successResponse({
                    ...toSend,
                    token,
                }),
                CREATED,
            );
        } catch (error) {
            logger.error('error while register', { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * @description Logins user controller
     * @Post
     * @async
     * @public
     * @method {login}
     * @memberologinf {UserController}
     * @description Logins user controller
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async login(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            logger.info(`login ${req.body.email}`);
            const loginCredentials = req.body;

            const stored = await this.userService.getUserByEmail(
                loginCredentials.email,
            );

            if (stored === null) {
                logger.warn(`user not found: ${loginCredentials.email}`);

                return apiResponse(
                    res,
                    failedResponse('user not found'),
                    NOT_FOUND,
                );
            }

            const samePassword = await isEqualsPassword(
                stored.password,
                loginCredentials.password,
            );

            if (!samePassword) {
                logger.warn('wrong password');
                return apiResponse(
                    res,
                    failedResponse('user not found'),
                    NOT_FOUND,
                );
            }

            const toSend = {
                id: stored.id,
                email: stored.email,
                firstName: stored.firstName,
                middleName: stored.middleName,
                lastName: stored.lastName,
            };

            const token = createToken(toSend);

            return apiResponse(
                res,
                successResponse({
                    ...toSend,
                    token,
                }),
                OK,
            );
        } catch (error) {
            logger.error('error while register', { meta: { ...error } });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Gets all the users stored at the db
     * @Get
     * @async
     * @public
     * @method {getAllUsers}
     * @memberologinf {UserController}
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async getAllUsers(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        logger.info('getAllUsers');
        try {
            const users = await this.userService.getAllUsers();

            return apiResponse(res, successResponse(users), OK);
        } catch (error) {
            logger.error('error while getting all users', {
                meta: { ...error },
            });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR,
            );
        }
    }
}
