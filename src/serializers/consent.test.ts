import faker from '@faker-js/faker';
import { Consent, ConsentType } from '@prisma/client';
import ConsentSerializer from './consent';
import db from '../lib/db';

describe('ConsentSerializer', () => {
  let consent: Consent;

  beforeEach(async () => {
    const user = await db.user.create({ data: { email: faker.internet.email() } });

    consent = await db.consent.create({
      data: {
        type: faker.random.arrayElement(Object.values(ConsentType)),
        enabled: faker.random.arrayElement([true, false]),
        userId: user.id,
      },
    });
  });

  it('serializes a consent object', () => {
    const serialized = ConsentSerializer.model(consent);
    expect(serialized).toBeInstanceOf(Object);
    expect(serialized).toEqual({
      id: consent.type,
      enabled: consent.enabled,
    });
  });

  it('serializes a list of consent objects', () => {
    const serialized = ConsentSerializer.list([consent]);
    expect(serialized).toBeInstanceOf(Array);
    expect(serialized).toHaveLength(1);
    const [obj] = serialized;
    expect(obj).toBeInstanceOf(Object);
    expect(obj).toEqual({
      id: consent.type,
      enabled: consent.enabled,
    });
  });
});
