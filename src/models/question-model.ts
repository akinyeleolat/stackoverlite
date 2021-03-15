/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize';

export interface QuestionAttributes {
    id: number;
    title: string;
    slug: string;
    description: string;
    text: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface QuestionModel
    extends Model<QuestionAttributes>,
        QuestionAttributes {
    [x: string]: any;
}
export class Question extends Model<QuestionModel, QuestionAttributes> {}

export type QuestionStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): QuestionModel;
};

export function QuestionFactory(sequelize: Sequelize): QuestionStatic {
    return <QuestionStatic>sequelize.define('Question', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
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
