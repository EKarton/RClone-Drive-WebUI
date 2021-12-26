import actionTypes from '../actionTypes';
import reducer from '../reducer';

describe('reducer', () => {
  it('should set endpoint correctly given type is SET_ENDPOINT', () => {
    const state = {
      endpoint: 'http://localhost:5572',
      username: 'admin',
      password: 'password',
    };

    const newState = reducer(state, {
      type: actionTypes.SET_ENDPOINT,
      payload: 'google.com',
    });

    expect(newState).toEqual({
      endpoint: 'google.com',
      username: 'admin',
      password: 'password',
    });
  });

  it('should set username correctly given type is SET_USERNAME', () => {
    const state = {
      endpoint: 'http://localhost:5572',
      username: 'admin',
      password: 'password',
    };

    const newState = reducer(state, {
      type: actionTypes.SET_USERNAME,
      payload: 'bob',
    });

    expect(newState).toEqual({
      endpoint: 'http://localhost:5572',
      username: 'bob',
      password: 'password',
    });
  });

  it('should set password correctly given type is SET_PASSWORD', () => {
    const state = {
      endpoint: 'http://localhost:5572',
      username: 'admin',
      password: 'password',
    };

    const newState = reducer(state, {
      type: actionTypes.SET_PASSWORD,
      payload: '1234',
    });

    expect(newState).toEqual({
      endpoint: 'http://localhost:5572',
      username: 'admin',
      password: '1234',
    });
  });

  it('should throw an error given unknown type', () => {
    const state = {
      endpoint: 'http://localhost:5572',
      username: 'admin',
      password: 'password',
    };

    expect(() => reducer(state, { type: 'random type' })).toThrowError();
  });
});
