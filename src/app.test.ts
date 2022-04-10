import faker from '@faker-js/faker';
import { ConsentType, User } from '@prisma/client';
import request from 'supertest';
import app from './app';
import db from './lib/db';

/*
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Events endpoints
router.post('/events', createEvent);
*/

describe('POST /users', () => {
  it('returns a 422 HTTP error when the email is not provided', async () => {
    const response = await request(app)
      .post('/users')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(422);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.error).toEqual('You have to provide a valid email');
  });

  it('returns a 422 HTTP error when the email is invalid', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'invalidemail' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(422);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.error).toEqual('You have to provide a valid email');
  });

  it('returns a 422 when the user already exists', async () => {
    const existingUser = await db.user.create({ data: { email: faker.internet.email() } });

    const response = await request(app)
      .post('/users')
      .send({ email: existingUser.email })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(422);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.error).toEqual('The user already exists');
  });

  it('creates a user', async () => {
    const email = faker.internet.email();

    const response = await request(app)
      .post('/users') .send({ email })
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toMatchObject({ email, consents: [] });
  });
});

describe('GET /users/:id', () => {
  it('returns a 404 when the user is not found', async () => {
    const response = await request(app)
      .get('/users/abc-123')
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.statusCode).toEqual(404);
    expect(response.body).toMatchObject({ error: 'The user was not found' });
  });

  it('returns a 200 and the user object when the user id is valid', async () => {
    const user = await db.user.create({ data: { email: faker.internet.email() } });
    const response = await request(app)
      .get(`/users/${user.id}`)
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject({ id: user.id, email: user.email, consents: [] });
  });
});

describe('DELETE /users/:id', () => {
  it('returns a 404 when the user is not found', async () => {
    const response = await request(app)
      .delete('/users/abc-123')
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.statusCode).toEqual(404);
    expect(response.body).toMatchObject({ error: 'The user was not found' });
  });

  it('returns a 204 and the user exists', async () => {
    const user = await db.user.create({ data: { email: faker.internet.email() } });
    const response = await request(app)
      .delete(`/users/${user.id}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(204);
    expect(response.body).toEqual({});
  });
});

describe('POST /events', () => {
  let user: User;

  beforeAll(async () => {
    user = await db.user.create({ data: { email: faker.internet.email() } });
  });

  it('creates an event', async () => {
    const response = await request(app)
      .post('/events')
      .set('Accept', 'application/json')
      .send({
        user: {
          id: user.id,
        },
        consents: [
          { id: ConsentType.email_notifications, enabled: true },
          { id: ConsentType.sms_notifications, enabled: true },
        ],
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: ConsentType.email_notifications, enabled: true }),
        expect.objectContaining({ type: ConsentType.sms_notifications, enabled: true }),
      ]),
    );
  });
});


describe('Example with subsequent updates', () => {
  it('creates a user, consents and returns the expected payload', async () => {
    const email = faker.internet.email();
    const userResponse = await request(app)
      .post('/users').send({ email })
      .set('Accept', 'application/json');

    expect(userResponse.headers['content-type']).toMatch(/json/);
    expect(userResponse.statusCode).toEqual(201);
    expect(userResponse.body).toMatchObject({ email, consents: [] });

    const { body: { id: userId } } = userResponse;
    expect(userId).not.toBeUndefined();

    const singleConsentResponse = await request(app)
      .post('/events')
      .set('Accept', 'application/json')
      .send({
        user: { id: userId },
        consents: [{ id: ConsentType.email_notifications, enabled: true }],
      });

    expect(singleConsentResponse.statusCode).toEqual(201);

    const userResponseAfterConsent = await request(app)
      .get(`/users/${userId}`).send({ email })
      .set('Accept', 'application/json');

    expect(userResponseAfterConsent.statusCode).toEqual(200);
    expect(userResponseAfterConsent.body).toMatchObject({
      id: userId,
      email,
      consents: [{
        id: ConsentType.email_notifications,
        enabled: true,
      }],
    });

    const doubleConsentResponse = await request(app)
      .post('/events')
      .set('Accept', 'application/json')
      .send({
        user: { id: userId },
        consents: [
          { id: ConsentType.email_notifications, enabled: false },
          { id: ConsentType.sms_notifications, enabled: true },
        ],
      });

    expect(doubleConsentResponse.statusCode).toEqual(201);

    const userResponseFinal = await request(app)
      .get(`/users/${userId}`).send({ email })
      .set('Accept', 'application/json');

    expect(userResponseFinal.statusCode).toEqual(200);
    expect(userResponseFinal.body).toMatchObject({
      id: userId,
      email,
      consents: [{
        id: ConsentType.email_notifications,
        enabled: false,
      }, {
        id: ConsentType.sms_notifications,
        enabled: true,
      }],
    });
  });
});
