import { createContext, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

const initialState = {
  endpoint: undefined,
  username: undefined,
  password: undefined,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children, defaultState }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider, actionTypes, initialState };
