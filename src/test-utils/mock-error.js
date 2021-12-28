/**
 * Replaces the error object's stack trace with mock data
 * @param {Error} error the Error object
 * @returns {Error} the same error, but with the stack trace mocked
 */
export function mockErrorStackTrace(error) {
  error.stack = 'Mock content for stack trace';
  return error;
}
