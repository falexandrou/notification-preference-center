import faker from '@faker-js/faker';
import db from '../lib/db';
import UserHandler from './user';

describe('UserHandler', () => {
  describe('create', () => {
    it('raises an error when no email has been provided', async () => {
      expect(UserHandler.create()).rejects.toThrow('You have to provide a valid email');
    });

    it('raises an error when the email provided is invalid', async () => {
      expect(UserHandler.create({ email: 'abcdefg' })).rejects.toThrow(
        'You have to provide a valid email',
      );
    });

    it('raises an error if the user already exists', async () => {
      const email = faker.internet.email();
      await db.user.deleteMany({ where: { email } });
      await db.user.create({ data: { email } });

      expect(UserHandler.create({ email })).rejects.toThrow('The user already exists');
    });

    it('creates the user when the user doesn’t exist', async () => {
      const email = faker.internet.email();
      await db.user.deleteMany({ where: { email } });

      const user = await UserHandler.create({ email });
      expect(user.email).toEqual(email);
    });
  });

  describe('get', () => {
    it('raises an error for a missing id', async () => {
      expect(UserHandler.get('')).rejects.toThrow('The user was not found');
    });

    it('raises an error when the user was not found', async () => {
      expect(UserHandler.get('abc123')).rejects.toThrow('The user was not found');
    });

    it('returns the user and their consents when the user exists', async () => {
      const email = faker.internet.email();
      const created = await db.user.create({ data: { email } });

      const user = await UserHandler.get(created.id);
      expect(user.id).toEqual(user.id);
    });
  });
});
