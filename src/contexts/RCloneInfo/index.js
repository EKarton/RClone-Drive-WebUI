import { createContext, useEffect, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

export const InitialState = {
  endpoint: localStorage.getItem('endpoint'),
  username: localStorage.getItem('username'),
  password: localStorage.getItem('password'),
};

export const RCloneInfoContext = createContext(InitialState);

export const RCloneInfoProvider = ({ children, defaultState = InitialState }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    if (state.endpoint) {
      localStorage.setItem('endpoint', state.endpoint);
    } else {
      localStorage.clear('endpoint');
    }
  }, [state.endpoint]);

  useEffect(() => {
    if (state.username) {
      localStorage.setItem('username', state.username);
    } else {
      localStorage.clear('username');
    }
  }, [state.username]);

  useEffect(() => {
    if (state.password) {
      localStorage.setItem('password', state.password);
    } else {
      localStorage.clear('password');
    }
  }, [state.password]);

  return (
    <RCloneInfoContext.Provider value={{ state, dispatch }}>
      {children}
    </RCloneInfoContext.Provider>
  );
};

export { actionTypes };
