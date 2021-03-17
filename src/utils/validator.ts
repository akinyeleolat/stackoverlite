/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isAlpha, isAlphanumeric, isEmail, isEmpty, isLength } from 'validator';
import {
    AnswerParams,
    JwtError,
    LoginCredentials,
    QuestionParams,
    UserRegister,
    AnswerStatus,
} from '../types';
import { logger } from './logger';

/**
 * @description Validates login
 * @author `Tosin Akinyele`
 * @param {LoginCredentials} credentials
 * @returns {Array} array of errors found
 */
export function validateLogin(credentials: LoginCredentials) {
    logger.info('validateLogin');
    const errors: any = [];

    const { email = '', password = '' } = credentials;

    if (isEmpty(email)) {
        errors.push({ email: 'email is required' });
    } else if (!isEmail(email)) {
        errors.push({ email: 'please provide a valid email' });
    }

    if (isEmpty(password)) {
        errors.push({ password: 'password is required' });
    } else if (!isLength(password, { min: 5, max: 15 })) {
        errors.push({ password: 'passwords must be from 5 to 15 characters' });
    }

    return errors;
}
/**
 * validates if the client input to save a new user is valid
 * @param {UserRegister} user User Model
 * @returns {Array} array of errors found
 */
export function validateUserRegistration(user: UserRegister) {
    const errors: any = [];

    const {
        email = '',
        password = '',
        password2 = '',
        firstName = '',
        middleName = '',
        lastName = '',
    } = user;

    if (isEmpty(email)) {
        errors.push({ email: 'email is required', code: 1 });
    } else if (!isEmail(email)) {
        errors.push({ email: 'invalid format', code: 2 });
    }

    if (isEmpty(password)) {
        errors.push({ password: 'password is required' });
    } else if (!isLength(password, { min: 5, max: 15 })) {
        errors.push({
            password: 'password should be from 5 to 15 characters long',
        });
    } else if (!isAlphanumeric(password)) {
        errors.push({ password: 'password should be alphanumeric' });
    } else if (password !== password2) {
        errors.push({ password2: 'passwords  must match' });
    }

    if (isEmpty(firstName)) {
        errors.push({ firstName: 'first Name is Required' });
    } else if (!isAlpha(firstName)) {
        errors.push({
            name: 'are you a robot, how come you dont have an standard name',
        });
    } else if (!isLength(firstName, { min: 1, max: 50 })) {
        errors.push({ name: 'name must be less than 50 chars' });
    }

    if (!isEmpty(middleName) && !isAlpha(middleName)) {
        errors.push({
            middleName: 'middlename should be valid',
        });
    } else if (
        !isEmpty(middleName) &&
        !isLength(middleName, { min: 1, max: 50 })
    ) {
        errors.push({
            middleName: 'middlename should not be greater than 50 characters',
        });
    }

    if (isEmpty(lastName)) {
        errors.push({ lastName: 'lastName is Required' });
    } else if (!isAlpha(lastName)) {
        errors.push({
            lastName:
                'is you a rotob, how come you dont have an standard lastName',
        });
    } else if (!isLength(lastName, { min: 1, max: 50 })) {
        errors.push({ lastName: 'name must be less than 50 chars' });
    }

    return errors;
}

/**
 * @description Determines whether token expired
 * @author `Tosin Akinyele`
 * @param {JwtError} error
 * @returns {boolean} true if token died
 */
export function isTokenExpired(error: JwtError) {
    return error && error.name && error.name === 'TokenExpiredError';
}

/**
 * function that validates if the input sended from the client is really a number
 * @param {number} param numeric value
 * @return {boolean} `true` if the input is number
 */
export function isNumber(param: unknown): boolean {
    const value: boolean = Number(param) === Number(param) ? true : false;

    return value;
}

/**
 * Removes empty properties from a given object
 * @author `Tosin Akinyele`
 * @param {object} obj
 * @returns {object} empty
 */
export function removeEmpty(obj: object): any {
    return Object.entries(obj)
        .filter(([_, v]) => v != null)
        .reduce(
            (acc, [k, v]) => ({
                ...acc,
                [k]: v === Object(v) ? removeEmpty(v) : v,
            }),
            {},
        );
}

/**
 * validates if the client input to save a question user is valid
 * @param {QuestionParams} question Question Model
 * @returns {Array} array of errors found
 */
export function validateCreateQuestion(question: QuestionParams) {
    const errors: any = [];

    const { title = '', text = '' } = question;

    if (isEmpty(title)) {
        errors.push({ title: 'title is required' });
    } else if (!isLength(title, { min: 50, max: 100 })) {
        errors.push({ title: 'title should be from 5 to 15 characters long' });
    }

    if (isEmpty(text)) {
        errors.push({ text: 'question text is Required' });
    } else if (!isLength(text, { min: 50, max: 200 })) {
        errors.push({ name: 'text cannot be less than 50 chars' });
    }

    return errors;
}

/**
 * validates if the client input to save a answer is valid
 * @param {AnswerParams} answer Asnwer Model
 * @returns {Array} array of errors found
 */
export function validateCreateAnswer(answerInput: AnswerParams) {
    const errors: any = [];

    const { answer, questionId } = answerInput;

    if (isEmpty(answer)) {
        errors.push({ answer: 'answer input is required' });
    } else if (!isLength(answer, { min: 50, max: 200 })) {
        errors.push({ name: 'answer cannot be less than 50 chars' });
    }

    if (isEmpty(questionId.toString())) {
        errors.push({ questionId: 'question id is missing' });
    } else if (!isNumber(questionId)) {
        errors.push({ questionId: 'Question id supplied is not number' });
    }

    return errors;
}

/**
 * validates if the client input to update a answer is valid
 * @param {AnswerParams} answer Asnwer Model
 * @returns {Array} array of errors found
 */
export function validateUpdateAnswer(answerInput: AnswerParams) {
    const errors: any = [];

    const { answer = '', questionId, id, status } = answerInput;

    if (answer && isEmpty(answer)) {
        errors.push({ answer: 'answer input is empty' });
    } else if (answer && !isLength(answer, { min: 50, max: 200 })) {
        errors.push({ name: 'answer cannot be less than 50 chars' });
    }

    if (isEmpty(questionId.toString())) {
        errors.push({ questionId: 'question id is missing' });
    } else if (!isNumber(questionId)) {
        errors.push({ questionId: 'Question id supplied is not number' });
    }

    if (id && isEmpty(id.toString())) {
        errors.push({ id: 'answer id is missing' });
    } else if (!isNumber(id)) {
        errors.push({ id: 'answer id supplied is not number' });
    }

    if (status && isEmpty(status.toString())) {
        errors.push({ status: 'answer status is missing' });
    } else if (status && !Object.values(AnswerStatus).includes(status)) {
        errors.push({ status: 'Invalid answer status' });
    }

    return errors;
}
