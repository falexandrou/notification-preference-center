import faker from '@faker-js/faker';
import { getMockReq, getMockRes } from '@jest-mock/express'
import { ConsentType, User } from '@prisma/client';
import db from './lib/db';
import { createUser, getUserById, deleteUser, createEvent } from './routes';

describe('Routes - Integration', () => {
  describe('createUser', () => {
    it('creates the user, returns 201 for a valid payload', async () => {
      const email = faker.internet.email();
      const req = getMockReq({ body: { email } })
      const { res } = getMockRes();

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ email, consents: [] }),
      );
    })
  });

  describe('getUserById', () => {
    it('gets the user by id', async () => {
      const email = faker.internet.email();
      const user = await db.user.create({ data: { email } });

      const req = getMockReq({ params: { id: user.id } });
      const { res } = getMockRes();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: user.id, email, consents: [] }),
      );
    });
  });

  describe('deleteUser', () => {
    it('deletes a user', async () => {
      const email = faker.internet.email();
      const user = await db.user.create({ data: { email } });

      const req = getMockReq({ params: { id: user.id } });
      const { res } = getMockRes();

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).not.toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('createEvent', () => {
    let user: User;
    let email: string;

    beforeAll(async () => {
      email = faker.internet.email();
      user = await db.user.create({ data: { email } });
    });

    beforeEach(async () => {
      await Promise.all([
        db.consent.deleteMany({ where: { userId: user.id } }),
        db.event.deleteMany({ where: { userId: user.id } }),
      ]);
    });

    it('creates an event', async () => {
      const { res } = getMockRes();
      const req = getMockReq({
        body: {
          user: { id: user.id },
          consents: [{ id: ConsentType.email_notifications, enabled: true }],
        },
      });

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ type: ConsentType.email_notifications, enabled: true }),
        ]),
      )
    });

    it('creates multiple events', async () => {
      const { res } = getMockRes();
      const req = getMockReq({
        body: {
          user: { id: user.id },
          consents: [
            { id: ConsentType.email_notifications, enabled: true },
            { id: ConsentType.sms_notifications, enabled: false },
          ],
        },
      });

      await createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenLastCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ type: ConsentType.email_notifications, enabled: true }),
          expect.objectContaining({ type: ConsentType.sms_notifications, enabled: false }),
        ]),
      );
    });
  });
});
