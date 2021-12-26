import { createContext, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

const initialState = {
  fileInfo: {
    remote: undefined,
    folderPath: undefined,
    fileName: undefined,
  },
  isOpen: false,
};

const store = createContext(initialState);
const { Provider } = store;

const FileViewerProvider = ({ children, defaultState = initialState }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, FileViewerProvider, actionTypes, initialState };
