import Bluebird from 'bluebird';
import { DB } from '../models';
import { Op } from 'sequelize';
import { AnswerModel } from '../models/answer-model';
import { QuestionModel } from '../models/question-model';
import { AnswerParams } from '../types';

/**
 * @description Answer service
 * @class
 * @public
 * @author `Tosin Akinyele`
 */
export class AnswerService {
    /**
     * @description Db of answer service
     * @type {DB}
     */
    private db: DB;

    /**
     * Creates an instance of answer service.
     * @author `Tosin`
     * @constructor
     * @param {DB} `db`
     */
    public constructor(db: DB) {
        this.db = db;
        this.save = this.save.bind(this);
        this.getAnswerByUser = this.getAnswerByUser.bind(this);
        this.getAnswerById = this.getAnswerById.bind(this);
        this.getQuestionById = this.getQuestionById.bind(this);
    }

    /**
     * creates a new answer or updates an existing one
     * @public
     * @method {save}
     * @memberof {AnswerService}
     * @param {object} answer
     * @returns {object} userobject
     */
    public async save(answer: AnswerParams): Bluebird<AnswerModel | null> {
        let answerValue;
        if (answer.id !== undefined) {
            await this.db.Answer.update(answer, {
                where: {
                    id: answer.id,
                },
                returning: true,
            });
            answerValue = await this.db.Answer.findByPk(answer.id);
            return answerValue;
        }

        answerValue = await this.db.Answer.create(answer);
        return answerValue;
    }

    /**
     * looks for a answer with `answer` and `userId`
     * @public
     * @method {getAnswerByUser}
     * @memberof {AnswerService}
     * @param {string} answer
     * @param {number} userId
     * @returns {Bluebird<AnswerModel | null>} answer object incase the answer already posted by the user
     */
    public async getAnswerByUser(
        answer: string,
        userId: number,
    ): Bluebird<AnswerModel | null> {
        const saved = await this.db.Answer.findOne({
            where: { answer, userId },
        });
        return saved;
    }

    /**
     * looks for a answer with `answer` by `id`
     * @public
     * @method {getAnswerById}
     * @memberof {AnswerService}
     * @param {number} id
     * @returns {Bluebird<AnswerModel | null>} answer object by id
     */
    public async getAnswerById(id: number): Bluebird<AnswerModel | null> {
        const saved = await this.db.Answer.findByPk(id);
        return saved;
    }

    /**
     * looks for a answer with `answer` by `id`
     * @public
     * @method {getAnswerById}
     * @memberof {AnswerService}
     * @param {number} id
     * @returns {Bluebird<QuestionModel | null>} answer object by id
     */
    public async getQuestionById(
        questionId: number,
    ): Bluebird<QuestionModel | null> {
        const saved = await this.db.Question.findByPk(questionId);
        return saved;
    }
}
