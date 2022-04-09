import faker from '@faker-js/faker';
import { Consent, ConsentType, User } from '@prisma/client';
import db from '../lib/db';
import UserSerializer from './user';

describe('UserSerializer', () => {
  let user: User & { consents: Consent[] } | null;
  let email: string;

  beforeEach(async () => {
    email = faker.internet.email();

    const u = await db.user.create({ data: { email } });

    await db.consent.createMany({
      data: [{
        type: ConsentType.email_notifications,
        enabled: faker.random.arrayElement([true, false]),
        userId: u.id,
      }, {
        type: ConsentType.sms_notifications,
        enabled: faker.random.arrayElement([true, false]),
        userId: u.id,
      }],
    });

    user = await db.user.findUnique({
      where: { id: u.id },
      include: { consents: true },
    });
  });

  it('serializes a user object', () => {
    const { id, email, consents } = user!
    const serialized = UserSerializer.model(user!);
    expect(serialized).toBeInstanceOf(Object);
    expect(serialized).toEqual({
      id,
      email,
      consents: consents.map(({ type: id, enabled }) => ({ id, enabled })),
    });
  });

  it('serializes a list of user objects', () => {
    const models = [user!];
    const serialized = UserSerializer.list(models);
    expect(serialized).toBeInstanceOf(Array);
    expect(serialized).toHaveLength(1);
  });
});
