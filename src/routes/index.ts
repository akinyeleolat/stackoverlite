/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Router } from 'express';
import {
    UserController,
    AnswerController,
    QuestionController,
} from '../controllers';

import { DB } from '../models/index';
import { AnswerService, QuestionService, UserService } from '../services';
import {
    validateAnswerInput,
    validateAnswerUpdate,
    validateQuestionInput,
    validateRegister,
    validatingLogin,
    verifyUser,
    validateRatingQuestion,
    validateRatingAnswer,
} from '../utils/middlewares';

export function routes(db: DB) {
    const api = Router();

    const userController = new UserController(new UserService(db));
    const questionController = new QuestionController(new QuestionService(db));
    const answerController = new AnswerController(new AnswerService(db));

    api.post('/auth/signup', [validateRegister], userController.register);
    api.post('/auth/login', [validatingLogin], userController.login);

    api.use(verifyUser);
    api.get('/userList', userController.getAllUsers);

    /**Question route */
    api.post(
        '/question',
        [validateQuestionInput],
        questionController.createQuestion,
    );
    api.get('/question', questionController.getAllQuestions);
    api.get('/question/:id', questionController.getQuestionDataById);
    api.post('/answer', [validateAnswerInput], answerController.createAnswer);
    api.patch(
        '/update_answer',
        [validateAnswerUpdate],
        answerController.updateAnswer,
    );

    api.post(
        '/rate_question',
        [validateRatingQuestion],
        questionController.rateQuestion,
    );

    api.post(
        '/rate_answer',
        [validateRatingAnswer],
        answerController.rateAnswer,
    );

    return api;
}
