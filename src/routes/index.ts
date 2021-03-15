/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Router } from 'express';
import {
    // SkillsController,
    UserController,
} from '../controllers';
import { QuestionController } from '../controllers/question.controller';
import { DB } from '../models/index';
import {
    QuestionService,
    // SkillsService,
    UserService,
} from '../services';
import {
    validateQuestionInput,
    validateRegister,
    validatingLogin,
    verifyUser,
} from '../utils/middlewares';

export function routes(db: DB) {
    const api = Router();

    const userController = new UserController(new UserService(db));
    const questionController = new QuestionController(new QuestionService(db));
    // const skillsController = new SkillsController(new SkillsService(db));

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

    return api;
}
