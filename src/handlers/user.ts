import { Prisma, User } from '@prisma/client';

import db from '../lib/db';
import { NotFoundError, ValidationError } from '../lib/errors';
import { isEmail, isNil } from '../lib/utils';

export type CreateUserPayload = {
  email?: string;
};

class UserHandler {
  /**
   * Creates a user
   *
   * @param {CreateUserPayload} data the data to create the user by
   * @returns {Promise<User>} the user created
   * @throws {ValidationError}
   */
  static async create(data: CreateUserPayload = {}): Promise<User> {
    const { email } = data;

    if (!isNil(email) || !(typeof email === 'string')) {
      throw new ValidationError('The user’s email is required');
    }

    if (!isEmail(email)) {
      throw new ValidationError('The user’s email is required');
    }

    try {
      const user = await db.user.create({ data: { email } });
      return user;
    } catch (error) {
      // This is prisma's way of complaining about a non unique value
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ValidationError('The user already exists');
      }

      throw error;
    }
  }

  /**
   * Fetches a user
   *
   * @param {String} id the id of the user to fetch
   * @returns {Promise<User>} the user fetched
   * @throws {NotFoundError}
   */
  static async get(id: string) {
    const user = await db.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundError('The user was not found');
    }

    return user;
  }

  /**
   * (Soft) Deletes a user
   *
   * @param {String} id the id of the user to delete
   */
  static async delete(id: string) {
    await db.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default UserHandler;
