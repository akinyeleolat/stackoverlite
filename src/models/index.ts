import { Sequelize } from 'sequelize';
import { UserFactory, UserStatic } from './user-model';
import { SkillsFactory, SkillsStatic } from './skills-model';
import { SkillsTypeFactory, SkillsTypeStatic } from './skills-type-model';
import { dbEnv as envConfig } from '../config';

export interface DB {
    dbConfig: Sequelize;
    User: UserStatic;
    Skills: SkillsStatic;
    SkillsType: SkillsTypeStatic;
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
const Skills = SkillsFactory(dbConfig);
const SkillsType = SkillsTypeFactory(dbConfig);

SkillsType.belongsTo(Skills);
SkillsType.belongsToMany(User, { through: 'users_has_skills' });
User.belongsToMany(SkillsType, { through: 'users_has_skills' });

export const db: DB = {
    dbConfig,
    User,
    Skills,
    SkillsType,
};
