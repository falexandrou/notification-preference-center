import faker from '@faker-js/faker';
import { ConsentType, User } from '@prisma/client';
import db from '../lib/db';
import EventHandler, { CreateEventPayload } from './event';

describe('EventHandler', () => {
  let user: User;

  beforeAll(async () => {
    user = await db.user.create({
      data: { email: faker.internet.email() },
    });
  });

  describe('create', () => {
    it('raises a ValidationError when no user id is provided', async () => {
      expect(EventHandler.create()).rejects.toThrow('A user ID should be specified');
    });

    it('raises an error when the user is not found', async () => {
      const userId = 'abc-1234';
      await db.user.deleteMany({ where: { id: userId } });

      expect(EventHandler.create({ user: { id: userId } })).rejects.toThrow(
        `User with ID ${userId} does not exist`
      );
    });

    it('raises an error when a set of consents is not provided', async () => {
      expect(EventHandler.create({ user: { id: user.id } })).rejects.toThrow(
        'You have to specify a set of consents',
      );
    });

    it('raises an error when the list of consents contains invalid types', async () => {
      const payload = {
        user: { id: user.id },
        consents: [
          { id: faker.lorem.word(), enabled: true },
          { id: faker.lorem.word(), enabled: false },
        ],
      } as CreateEventPayload;

      const types = Object.values(ConsentType);
      expect(EventHandler.create(payload)).rejects.toThrow(
        `You have specified invalid consent ids on your payload. Available options are ${types.join(', ')}`,
      );
    });

    it('creates and records the consents', async () => {
      const payload = {
        user: { id: user.id },
        consents: [
          { id: ConsentType.email_notifications, enabled: true },
          { id: ConsentType.sms_notifications, enabled: false },
        ],
      };

      await db.consent.deleteMany({ where: { userId: user.id } });

      const events = await EventHandler.create(payload);
      expect(events).toBeInstanceOf(Array);
      expect(events).toHaveLength(2);
      expect(events.map(({ type }) => type).sort()).toEqual([
        ConsentType.email_notifications,
        ConsentType.sms_notifications,
      ]);

      const consents = await db.consent.findMany({
        where: { userId: user.id },
      });

      expect(consents).toBeInstanceOf(Array);
      expect(consents).toHaveLength(2);

      const emailConsent = consents.find(({ type }) => type === ConsentType.email_notifications);
      expect(emailConsent).not.toBeNull();
      expect(emailConsent?.type).toEqual(ConsentType.email_notifications);
      expect(emailConsent?.enabled).toEqual(true);

      const smsConsent = consents.find(({ type }) => type === ConsentType.sms_notifications);
      expect(smsConsent).not.toBeNull();
      expect(smsConsent?.type).toEqual(ConsentType.sms_notifications);
      expect(smsConsent?.enabled).toEqual(false);
    });
  });
});
