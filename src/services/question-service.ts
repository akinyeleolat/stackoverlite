import Bluebird from 'bluebird';
import { DB } from '../models';
import { Op } from 'sequelize';
import { QuestionParams } from '../types';
import { QuestionModel } from '../models/question-model';
import { AnswerModel } from '../models/answer-model';

/**
 * @description Question service
 * @class
 * @public
 * @author `Tosin Akinyele`
 */
export class QuestionService {
    /**
     * @description Db of question service
     * @type {DB}
     */
    private db: DB;

    /**
     * Creates an instance of questions service.
     * @author `Tosin`
     * @constructor
     * @param {DB} `db`
     */
    public constructor(db: DB) {
        this.db = db;
        this.getAll = this.getAll.bind(this);
        // this.getSkillsByType = this.getSkillsByType.bind(this);
        this.save = this.save.bind(this);
        this.getQuestionByTitle = this.getQuestionByTitle.bind(this);
        this.getQuestionById = this.getQuestionById.bind(this);
    }

    /**
     * Gets Question
     * @public
     * @method {getAll}
     * @author Tosin
     * @memberof {QuestionService}
     * @returns {QuestionModel[]} all questions
     */
    public async getAll(): Bluebird<QuestionModel[]> {
        const res = await this.db.Question.findAll({
            attributes: ['id', 'slug', 'title', 'text', 'description'],
            // include answer && user, question rating, answer rating, user
            include: [
                {
                    all: true,
                },
            ],
        });
        res.forEach(value => {
            delete value.User.dataValues.password;
        });
        return res;
    }

    /**
     * creates a new question or updates an existing one
     * @public
     * @method {save}
     * @memberof {QuestionService}
     * @param {object} question
     * @returns {object} userobject
     */
    public async save(
        question: QuestionParams,
    ): Bluebird<QuestionModel | null> {
        let questionValue;
        if (question.id !== undefined) {
            await this.db.Question.update(question, {
                where: {
                    id: question.id,
                },
                returning: true,
            });
            questionValue = await this.db.Question.findByPk(question.id);
            return questionValue;
        }

        questionValue = await this.db.Question.create(question);
        return questionValue;
    }

    /**
     * looks for a question with a title `title`
     * @public
     * @method {getQuestionByTitle}
     * @memberof {QuestionService}
     * @param {string} title
     * @returns {Bluebird<QuestionModel | null>} question object incase the title exists
     */
    public async getQuestionByTitle(
        title: string,
    ): Bluebird<QuestionModel | null> {
        const saved = await this.db.Question.findOne({
            where: { title },
        });
        return saved;
    }

    /**
     * looks for a question with `question` by `id`
     * @public
     * @method {getQuestionById}
     * @memberof {QuestionService}
     * @param {number} id question id
     * @returns {Bluebird<QuestionModel | null>} answer object by id
     */
    public async getQuestionById(id: number): Bluebird<QuestionModel | null> {
        const saved = await this.db.Question.findByPk(id);
        console.log(saved && Object.keys(saved.__proto__));
        return saved;
    }
}
