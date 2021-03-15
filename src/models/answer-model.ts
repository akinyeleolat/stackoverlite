/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface AnswerAttributes {
    id: number;
    answer: string;
    status: string;
    userId: number;
    questionId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AnswerModel extends Model<AnswerAttributes>, AnswerAttributes {
    [x: string]: any;
}
export class Answer extends Model<AnswerModel, AnswerAttributes> {}

export type AnswerStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): AnswerModel;
};

export function AnswerFactory(sequelize: Sequelize): AnswerStatic {
    return <AnswerStatic>sequelize.define('Answer', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted'),
            defaultValue: 'pending',
            allowNull: false,
        },
        userId: {
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
