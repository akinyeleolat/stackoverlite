import Bluebird from 'bluebird';
import { Op } from 'sequelize';
import { UserRegister } from '../types';
import { DB } from '../models/index';
import { UserModel } from '../models/user-model';

/**
 * UserService class handles the logic needed to work with the users data.
 * @class
 * @public
 */
export class UserService {
    /**
     * Creates an instance of user service.
     * @param {DB} db
     */
    public constructor(private db: DB) {
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.save = this.save.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    /**
     * looks for a user wuth a given `email`
     * @public
     * @method {getUserByEmail}
     * @memberof {UserService}
     * @param {string} email
     * @returns {Bluebird<UserModel | null>} user object incase the email exists
     */
    public async getUserByEmail(email: string): Bluebird<UserModel | null> {
        const saved = await this.db.User.findOne({
            where: { email },
        });
        return saved;
    }

    /**
     * creates a new user or updates an existing one
     * @public
     * @method {save}
     * @memberof {UserService}
     * @param {object} user
     * @returns {object} userobject
     */
    public async save(user: UserRegister): Bluebird<UserModel | null> {
        let userValue;
        if (user.id !== undefined) {
            await this.db.User.update(user, {
                where: { [Op.and]: { id: user.id, email: user.email } },
                returning: true,
            });
            userValue = await this.db.User.findByPk(user.id);
            return userValue;
        }

        userValue = await this.db.User.create(user);
        return userValue;
    }

    public async getAllUsers(): Bluebird<{ rows: UserModel[]; count: number }> {
        const result = await this.db.User.findAndCountAll({
            attributes: ['id', 'firstName', 'middleName', 'lastName', 'email'],
        });
        return result;
    }
}
