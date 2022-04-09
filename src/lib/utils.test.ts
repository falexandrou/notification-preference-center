import faker from '@faker-js/faker';
import { isNil, isEmail } from './utils';

describe('isNil', () => {
  it('returns true for null values', () => {
    expect(isNil(null)).toBeTruthy();
  });

  it('returns true for undefiend values', () => {
    expect(isNil(undefined)).toBeTruthy();
  });

  it('returns false for other values', () => {
    expect(isNil('')).toBeFalsy();
    expect(isNil('abc')).toBeFalsy();
    expect(isNil(1234)).toBeFalsy();
    expect(isNil([])).toBeFalsy();
    expect(isNil({})).toBeFalsy();
  });
});

describe('isEmail', () => {
  it('returns true for valid emails', () => {
    expect(isEmail(faker.internet.email())).toBeTruthy();
  });

  it('returns false for invalid emails', () => {
    expect(isEmail('abc')).toBeFalsy();
    expect(isEmail('abc@example')).toBeFalsy();
    expect(isEmail('example.com')).toBeFalsy();
  });
});
