import { Sequelize } from 'sequelize';
import { createUniqueSlug, createEllipsis } from '../utils/modifier';
import { UserFactory, UserStatic } from './user-model';
import { QuestionFactory, QuestionStatic } from './question-model';
import { AnswerFactory, AnswerStatic } from './answer-model';
import {
    QuestionRatingFactory,
    QuestionRatingStatic,
} from './question-rating-model';
import { AnswerRatingFactory, AnswerRatingStatic } from './answer-rating-model';
import { dbEnv as envConfig } from '../config';

export interface DB {
    dbConfig: Sequelize;
    User: UserStatic;
    Question: QuestionStatic;
    Answer: AnswerStatic;
    QuestionRating: QuestionRatingStatic;
    AnswerRating: AnswerRatingStatic;
}

export const dbConfig = new Sequelize(
    envConfig.dbName,
    envConfig.dbUser,
    envConfig.dbPassword,
    {
        port: Number(envConfig.dbPort) || 54320,
        host: envConfig.dbHost || 'localhost',
        dialect: 'postgres',
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    },
);

const User = UserFactory(dbConfig);
const Question = QuestionFactory(dbConfig);
const Answer = AnswerFactory(dbConfig);
const QuestionRating = QuestionRatingFactory(dbConfig);
const AnswerRating = AnswerRatingFactory(dbConfig);

Question.belongsTo(User, { foreignKey: 'userId' });
Answer.belongsTo(User, { foreignKey: 'userId' });
Answer.belongsTo(Question, { foreignKey: 'questionId' });
Question.hasMany(Answer, { foreignKey: 'questionId' });
QuestionRating.belongsTo(Question, { foreignKey: 'questionId' });
Question.hasOne(QuestionRating, { foreignKey: 'questionId' });
AnswerRating.belongsTo(Answer, { foreignKey: 'answerId' });
Answer.hasOne(AnswerRating, { foreignKey: 'answerId' });

Question.beforeCreate(newQuestion => {
    newQuestion.setDataValue('slug', createUniqueSlug(newQuestion.title));
    newQuestion.setDataValue(
        'description',
        createEllipsis(newQuestion.text, 200),
    );
});

export const db: DB = {
    dbConfig,
    User,
    Question,
    Answer,
    QuestionRating,
    AnswerRating,
};
