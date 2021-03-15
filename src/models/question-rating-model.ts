/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface QuestionRatingAttributes {
    id: number;
    rating: number;
    questionId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface QuestionRatingModel
    extends Model<QuestionRatingAttributes>,
        QuestionRatingAttributes {
    [x: string]: any;
}
export class QuestionRating extends Model<
    QuestionRatingModel,
    QuestionRatingAttributes
> {}

export type QuestionRatingStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): QuestionRatingModel;
};

export function QuestionRatingFactory(
    sequelize: Sequelize,
): QuestionRatingStatic {
    return <QuestionRatingStatic>sequelize.define('QuestionRating', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
}
