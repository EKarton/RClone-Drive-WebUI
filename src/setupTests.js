// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock URL object
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock auto-generated IDs from MUI Material components
jest.mock('@mui/utils/useId', () => jest.fn().mockReturnValue('mui-test-id'));

// Mock local storage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

// Mock console
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock web workers
// Derived from https://github.com/nodejs/help/issues/2058
global.Worker = class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
    this.addEventListener = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
};
