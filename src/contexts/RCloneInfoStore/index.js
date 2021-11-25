import { createContext, useEffect, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

const initialState = {
  endpoint: localStorage.getItem('endpoint'),
  username: localStorage.getItem('username'),
  password: localStorage.getItem('password'),
};

const store = createContext(initialState);
const { Provider } = store;

const RCloneInfoStateProvider = ({ children, defaultState = initialState }) => {
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

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, RCloneInfoStateProvider, actionTypes, initialState };
