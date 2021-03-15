/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Router } from 'express';
import {
    // SkillsController,
    UserController,
} from '../controllers';
import { DB } from '../models/index';
import {
    // SkillsService,
    UserService,
} from '../services';
import { validateRegister, validatingLogin } from '../utils/middlewares';

export function routes(db: DB) {
    const api = Router();

    const userController = new UserController(new UserService(db));
    // const skillsController = new SkillsController(new SkillsService(db));

    api.post('/auth/signup', [validateRegister], userController.register);
    api.post('/auth/login', [validatingLogin], userController.login);
    api.get('/users', userController.getAllUsers);

    return api;
}
