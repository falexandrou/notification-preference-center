/**
 * Returns whether a value is null or undefined
 *
 * @param {any} value the value to check
 * @returns {Boolean} whether the value is null or undefined
 */
export const isNil = (value: any): boolean => (
  value === null || value === undefined
);

/**
 * Checks whether a given string value is a valid email address
 *
 * @param {String} value the value to check whether is an email
 * @returns {Boolean}
 */
export const isEmail = (value: string): boolean => (
  Boolean(
    value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
  )
);
