import { useContext } from 'react';
import actionTypes from './actionTypes';
import { FileUploadCountsContext } from './index';

export default function useFileUploadCounts() {
  const { state, dispatch } = useContext(FileUploadCountsContext);

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
