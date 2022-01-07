import { createContext, useContext, useReducer } from 'react';
import actionTypes from './actionTypes';
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

export function useFileUploadCounts() {
  const { state, dispatch } = useContext(FileUploadCountsContext);

  if (state === undefined) {
    throw new Error('This hook must be wrapped in FileUploadCountsProvider');
  }

  const updateUploadStatus = (prevStatus, curStatus) => {
    dispatch({
      type: actionTypes.UPDATE_STATUS,
      payload: [prevStatus, curStatus],
    });
  };

  const addUploadStatus = (curStatus) => {
    dispatch({
      type: actionTypes.ADD_STATUS,
      payload: curStatus,
    });
  };

  return {
    counts: state,
    updateUploadStatus,
    addUploadStatus,
  };
}
