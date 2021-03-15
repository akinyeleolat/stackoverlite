/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface AnswerRatingAttributes {
    id: number;
    rating: number;
    answerId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AnswerRatingModel
    extends Model<AnswerRatingAttributes>,
        AnswerRatingAttributes {
    [x: string]: any;
}
export class AnswerRating extends Model<
    AnswerRatingModel,
    AnswerRatingAttributes
> {}

export type AnswerRatingStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): AnswerRatingModel;
};

export function AnswerRatingFactory(sequelize: Sequelize): AnswerRatingStatic {
    return <AnswerRatingStatic>sequelize.define('AnswerRating', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answerId: {
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
