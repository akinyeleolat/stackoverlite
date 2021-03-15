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

import { QuestionService } from '../services';

import {
    apiResponse,
    failedResponse,
    successResponse,
} from '../utils/response';
import { logger } from '../utils/logger';
import { AuthRequest, QuestionParams, UserRegister } from '../types';
import { createEllipsis, createUniqueSlug } from '../utils/modifier';

/**
 * @description Question controller
 * @class
 * @public
 */
export class QuestionController {
    /**
     * @description Creates an instance of question controller.
     * @author `Tosin Akinyele`
     * @constructor
     * @param {QuestionService} questionService
     */
    public constructor(private questionService: QuestionService) {
        this.createQuestion = this.createQuestion.bind(this);
        this.getAllQuestions = this.getAllQuestions.bind(this);
    }

    /**
     * create a new question
     * @Post
     * @async
     * @public
     * @method {createQuestion}
     * @memberof {QuestionController}
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>} a promise of EndPointResponse
     */
    public async createQuestion(
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const question = <QuestionParams>req.body;

            if (!req.user) {
                logger.error(`empty userId`);
                return apiResponse(
                    res,
                    failedResponse('empty userId'),
                    BAD_REQUEST,
                );
            }
            logger.info('create question');
            const checkQuestionExist = await this.questionService.getQuestionByTitle(
                question.title,
            );
            if (checkQuestionExist !== null) {
                logger.error(`question already exists`);
                return apiResponse(
                    res,
                    failedResponse('question already exists'),
                    BAD_REQUEST,
                );
            }
            const user = <UserRegister>req.user;

            question.userId = user.id;
            question.slug = createUniqueSlug(question.title);
            question.description = createEllipsis(question.text, 50);

            const newQuestion = await this.questionService.save(question);

            return apiResponse(
                res,
                successResponse({
                    ...newQuestion?.get(),
                }),
                CREATED,
            );
        } catch (error) {
            logger.error('error while creating question', {
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
    public async getAllQuestions(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        logger.info('getAllQuestions');
        try {
            const questions = await this.questionService.getAll();

            return apiResponse(res, successResponse(questions), OK);
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
