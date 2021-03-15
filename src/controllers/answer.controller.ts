/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { NextFunction, Request, Response } from 'express';
import {
    BAD_REQUEST,
    CREATED,
    getStatusText,
    INTERNAL_SERVER_ERROR,
    OK,
} from 'http-status-codes';

import { AnswerService } from '../services';

import {
    apiResponse,
    failedResponse,
    successResponse,
} from '../utils/response';
import { logger } from '../utils/logger';
import { AuthRequest, AnswerParams, UserCredentials } from '../types';

/**
 * @description Answer controller
 * @class
 * @public
 */
export class AnswerController {
    /**
     * @description Creates an instance of answer controller.
     * @author `Tosin Akinyele`
     * @constructor
     * @param {AnswerService} answerService
     */
    public constructor(private answerService: AnswerService) {
        this.createAnswer = this.createAnswer.bind(this);
    }

    /**
     * create a new answer for question
     * @Post
     * @async
     * @public
     * @method {createAnswer}
     * @memberof {AnswerController}
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async createAnswer(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const answerValue = <AnswerParams>req.body;
            if (!req.user) {
                logger.error(`empty userId`);
                return apiResponse(
                    res,
                    failedResponse('empty userId'),
                    BAD_REQUEST,
                );
            }
            const user = <UserCredentials>req.user;

            answerValue.userId = user.id;

            const checkAnswerExist = await this.answerService.getAnswerByUser(
                answerValue.answer,
                answerValue.userId,
            );
            if (checkAnswerExist !== null) {
                logger.error(`answer already exists`);
                return apiResponse(
                    res,
                    failedResponse('answer already exists'),
                    BAD_REQUEST,
                );
            }

            logger.info('create answer for  question');

            const newAnswer = await this.answerService.save(answerValue);

            return apiResponse(
                res,
                successResponse({
                    ...newAnswer?.get(),
                }),
                CREATED,
            );
        } catch (error) {
            logger.error('error while creating answer', {
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
