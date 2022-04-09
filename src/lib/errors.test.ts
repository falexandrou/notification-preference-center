import { faker } from '@faker-js/faker';
import { ValidationError, NotFoundError, ApiError } from './errors';

describe('ValidationError', () => {
  let message: string;
  let error: ValidationError;

  beforeEach(() => {
    message = faker.lorem.sentence();
    error = new ValidationError(message);
  });

  it('extends the base class', () => {
    expect(error).toBeInstanceOf(ApiError);
  });

  it('uses the correct message', () => {
    expect(error.message).toEqual(message);
  });

  it('has the correct http status code set', () => {
    expect(error.httpStatusCode).toEqual(422);
  });
});

describe('NotFoundError', () => {
  let message: string;
  let error: NotFoundError;

  beforeEach(() => {
    message = faker.lorem.sentence();
    error = new NotFoundError(message);
  });

  it('extends the base class', () => {
    expect(error).toBeInstanceOf(ApiError);
  });

  it('uses the correct message', () => {
    expect(error.message).toEqual(message);
  });

  it('has the correct http status code set', () => {
    expect(error.httpStatusCode).toEqual(404);
  });
});
