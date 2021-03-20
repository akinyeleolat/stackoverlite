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

import { AnswerService } from '../services';

import {
    apiResponse,
    failedResponse,
    successResponse,
} from '../utils/response';
import { logger } from '../utils/logger';
import {
    AuthRequest,
    AnswerParams,
    UserCredentials,
    AnswerValue,
    AnswerStatus,
    AnswerRatingValue,
    AnswerRatingParams,
} from '../types';

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
        this.updateAnswer = this.updateAnswer.bind(this);
        this.rateAnswer = this.rateAnswer.bind(this);
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

            const checkQuestionExist = await this.answerService.getQuestionById(
                answerValue.questionId,
            );

            if (!checkQuestionExist) {
                logger.error(`question not found`);
                return apiResponse(
                    res,
                    failedResponse('question not found'),
                    NOT_FOUND,
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

    /**
     * update answer for question, user can update their own answer or accept other answer
     * @Post
     * @async
     * @public
     * @method {updateAnswer}
     * @memberof {AnswerController}
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async updateAnswer(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const answerValue = <AnswerValue>req.body;

            if (!req.user) {
                logger.error(`empty userId`);
                return apiResponse(
                    res,
                    failedResponse('empty userId'),
                    BAD_REQUEST,
                );
            }

            const checkQuestionExist = await this.answerService.getQuestionById(
                answerValue.questionId,
            );

            if (!checkQuestionExist) {
                logger.error(`question not found`);
                return apiResponse(
                    res,
                    failedResponse('question not found'),
                    NOT_FOUND,
                );
            }
            const previousAnswerObj = await this.answerService.getAnswerById(
                answerValue.id,
            );
            const existingAnswer = <AnswerValue>previousAnswerObj?.get();

            if (!existingAnswer) {
                logger.error(`answer not found`);
                return apiResponse(
                    res,
                    failedResponse('answer not found'),
                    NOT_FOUND,
                );
            }

            const user = <UserCredentials>req.user;

            let updatedAnswerValue;

            if (user.id === existingAnswer.userId) {
                logger.info('update answer for  question for user');
                //TODO: should answer be updated after it is accepted?
                updatedAnswerValue = {
                    ...existingAnswer,
                    answer: answerValue.answer,
                    updatedAt: Date.now(),
                };
            } else {
                logger.info('accept user answer');
                if (!answerValue.status) {
                    return apiResponse(
                        res,
                        failedResponse('answer status required'),
                        BAD_REQUEST,
                    );
                }
                if (
                    answerValue.status &&
                    !Object.values(AnswerStatus).includes(answerValue.status)
                ) {
                    return apiResponse(
                        res,
                        failedResponse('Invalid answer status'),
                        BAD_REQUEST,
                    );
                }

                updatedAnswerValue = {
                    ...existingAnswer,
                    status: answerValue.status,
                    updatedAt: Date.now(),
                };
            }

            const updatedAnswer = await this.answerService.save(
                updatedAnswerValue,
            );

            return apiResponse(
                res,
                successResponse({
                    ...updatedAnswer?.get(),
                }),
                OK,
            );
        } catch (error) {
            logger.error('error while updating answer', {
                meta: { ...error },
            });
            return apiResponse(
                res,
                failedResponse(getStatusText(INTERNAL_SERVER_ERROR)),
                INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * add rating or update existing answer rating
     * @Post
     * @async
     * @public
     * @method {rateAnswer}
     * @memberof {AnswerController}
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async rateAnswer(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            logger.info('rate answer');

            const ratingObject = <AnswerRatingParams>req.body;
            const { answerId } = ratingObject;

            const checkQuestionExist = await this.answerService.getQuestionById(
                answerId,
            );

            if (!checkQuestionExist) {
                logger.error(`question not found`);
                return apiResponse(
                    res,
                    failedResponse('question not found'),
                    NOT_FOUND,
                );
            }

            const previousRating = await this.answerService.getRatingByAnswerId(
                answerId,
            );

            const existingRating = <AnswerRatingValue>previousRating?.get();
            let ratingDataValue;
            if (existingRating) {
                ratingDataValue = {
                    ...ratingObject,
                    id: existingRating.id,
                    updatedAt: Date.now(),
                };
            } else {
                ratingDataValue = { ...ratingObject };
            }

            const updatedRating = await this.answerService.rateAnswer(
                ratingDataValue,
            );

            return apiResponse(
                res,
                successResponse({
                    ...updatedRating?.get(),
                }),
                OK,
            );
        } catch (error) {
            logger.error('error while getting all questions', {
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
