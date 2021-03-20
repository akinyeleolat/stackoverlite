import Bluebird from 'bluebird';
import { DB } from '../models';
import { Op } from 'sequelize';
import { QuestionParams, QuestionRatingParams } from '../types';
import { QuestionModel } from '../models/question-model';
import { AnswerModel } from '../models/answer-model';
import { QuestionRatingModel } from '../models/question-rating-model';

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
        this.rateQuestion = this.rateQuestion.bind(this);
        this.getRatingByQuestionId = this.getRatingByQuestionId.bind(this);
        this.getQuestionDataById = this.getQuestionDataById.bind(this);
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
    public async getQuestionDataById(
        id: number,
    ): Bluebird<QuestionModel | null> {
        const saved = await this.db.Question.findOne({
            where: { id },
            include: [
                {
                    model: this.db.Answer,
                    as: 'Answers',
                    attributes: ['id', 'answer', 'status'],
                    include: [
                        {
                            model: this.db.AnswerRating,
                            as: 'AnswerRating',
                            attributes: ['id', 'rating'],
                        },
                        {
                            model: this.db.User,
                            as: 'User',
                            attributes: ['id', 'firstName', 'lastName'],
                        },
                    ],
                },
                {
                    model: this.db.QuestionRating,
                    as: 'QuestionRating',
                    attributes: ['id', 'rating'],
                },
                {
                    model: this.db.User,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });

        return saved;
    }

    /**
     * create or updates answer rating
     * @public
     * @method {rateQuestion}
     * @memberof {QuestionService}
     * @param {object} questionRating
     * @returns {object} questionrating
     */
    public async rateQuestion(
        questionRating: QuestionRatingParams,
    ): Bluebird<QuestionRatingModel | null> {
        let questionRatingValue;
        if (questionRating.id !== undefined) {
            await this.db.QuestionRating.update(questionRating, {
                where: {
                    id: questionRating.id,
                },
                returning: true,
            });
            questionRatingValue = await this.db.QuestionRating.findByPk(
                questionRating.id,
            );
            return questionRatingValue;
        }

        questionRatingValue = await this.db.QuestionRating.create(
            questionRating,
        );
        return questionRatingValue;
    }

    /**
     * looks for a rating with a `questionId`
     * @public
     * @method {getRatingByQuestionId}
     * @memberof {QuestionService}
     * @param {string} questionId
     * @returns {Bluebird<QuestionRatingModel | null>} question rating object incase the rating exists
     */
    public async getRatingByQuestionId(
        questionId: number,
    ): Bluebird<QuestionRatingModel | null> {
        const saved = await this.db.QuestionRating.findOne({
            where: { questionId },
        });
        return saved;
    }
}
