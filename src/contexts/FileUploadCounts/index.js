import { createContext, useReducer } from 'react';
import reducer from './reducer';

export const InitialState = {
  numUploading: 0,
  numSuccessful: 0,
  numFailed: 0,
  numCancelled: 0,
};

export const FileUploadCountsContext = createContext(InitialState);

export const FileUploadCountsProvider = ({ children, defaultState = InitialState }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <FileUploadCountsContext.Provider value={{ state, dispatch }}>
      {children}
    </FileUploadCountsContext.Provider>
  );
};
