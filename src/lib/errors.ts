/**
 * @class ApiError
 * @abstract
 */
export abstract class ApiError extends Error {
  abstract httpStatusCode: number;
}

/**
 * Thrown when a validation error occurs
 */
export class ValidationError extends ApiError {
  /**
   * @var {Number} statusCode the HTTP status code to use when representing this error
   */
  httpStatusCode: number = 422;
}

/**
 * Throws when an object is not found
 */
export class NotFoundError extends ApiError {
  httpStatusCode: number = 404;
}
