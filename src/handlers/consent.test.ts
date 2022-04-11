import faker from '@faker-js/faker';
import { ConsentType, Event, User } from '@prisma/client';
import ConsentHandler from './consent';
import db from '../lib/db';

describe('ConsentHandler', () => {
  let emailEvent: Event;
  let smsEvent: Event;
  let user: User;

  beforeAll(async () => {
    user = await db.user.create({ data: { email: faker.internet.email() } });

    // Create outdated events
    const anHourAgo = new Date(Date.now() - 3600 * 1000);
    await db.event.createMany({
      data: [{
        type: ConsentType.email_notifications,
        enabled: false,
        userId: user.id,
        createdAt: anHourAgo,
      }, {
        type: ConsentType.sms_notifications,
        enabled: true,
        userId: user.id,
        createdAt: anHourAgo,
      }],
    });

    emailEvent = await db.event.create({
      data: {
        type: ConsentType.email_notifications,
        enabled: true,
        userId: user.id,
      },
    });

    smsEvent = await db.event.create({
      data: {
        type: ConsentType.sms_notifications,
        enabled: false,
        userId: user.id,
      },
    });
  });

  describe('mostRecentEvents', () => {
    it('returns the most recent events', async () => {
      const events = await ConsentHandler.mostRecentEvents(user.id);
      expect(events.map(({ id }) => id).sort()).toEqual([emailEvent.id, smsEvent.id].sort());
    });
  });

  describe('record', () => {
    it('records the state to a set of Consent objects', async () => {
      await ConsentHandler.record(user.id);

      const consents = await db.consent.findMany({
        where: { userId: user.id },
      });

      expect(consents).toBeInstanceOf(Array);
      expect(consents).toHaveLength(2);
      expect(consents.map(({ type }) => type).sort()).toEqual([
        ConsentType.email_notifications,
        ConsentType.sms_notifications,
      ]);

      const emailConsent = consents.find(({ type }) => type === ConsentType.email_notifications);
      expect(emailConsent).not.toBeNull();
      expect(emailConsent?.type).toEqual(ConsentType.email_notifications);
      expect(emailConsent?.enabled).toEqual(emailEvent.enabled);

      const smsConsent = consents.find(({ type }) => type === ConsentType.sms_notifications);
      expect(smsConsent).not.toBeNull();
      expect(smsConsent?.type).toEqual(ConsentType.sms_notifications);
      expect(smsConsent?.enabled).toEqual(smsEvent.enabled);
    });
  });
});
