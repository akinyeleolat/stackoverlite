/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { QueryInterface, DataTypes as Sequelize } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable('Answers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            answer: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'accepted'),
                defaultValue: 'pending',
                allowNull: false,
            },
            questionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('Answers');
    },
};
