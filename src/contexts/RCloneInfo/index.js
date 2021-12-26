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
    localStorage.setItem('endpoint', state.endpoint);
  }, [state.endpoint]);

  useEffect(() => {
    localStorage.setItem('username', state.username);
  }, [state.username]);

  useEffect(() => {
    localStorage.setItem('password', state.password);
  }, [state.password]);

  return (
    <RCloneInfoContext.Provider value={{ state, dispatch }}>
      {children}
    </RCloneInfoContext.Provider>
  );
};

export {
  RCloneInfoContext as store,
  // RCloneInfoProvider as RCloneInfoProvider,
  actionTypes,
  InitialState as initialState,
};
