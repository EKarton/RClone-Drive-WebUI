import { UploadStatusTypes } from 'utils/constants';
import actionTypes from './actionTypes';

function incrementValue(state, status, amount) {
  if (status === UploadStatusTypes.SUCCESS) {
    return { ...state, numSuccessful: state.numSuccessful + amount };
  }

  if (status === UploadStatusTypes.UPLOADING) {
    return { ...state, numUploading: state.numUploading + amount };
  }

  if (status === UploadStatusTypes.FAILED) {
    return { ...state, numFailed: state.numFailed + amount };
  }

  if (status === UploadStatusTypes.CANCELLED) {
    return { ...state, numCancelled: state.numCancelled + amount };
  }

  throw new Error(`Unknown status type ${status}`);
}

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_STATUS: {
      const [prevStatus, curStatus] = action.payload;
      const newState = incrementValue(
        incrementValue(state, prevStatus, -1),
        curStatus,
        1
      );

      return newState;
    }
    case actionTypes.ADD_STATUS: {
      const curStatus = action.payload;

      return incrementValue(state, curStatus, 1);
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
