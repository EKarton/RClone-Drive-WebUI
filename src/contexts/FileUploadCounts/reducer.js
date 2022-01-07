import { UploadStatusTypes } from 'utils/constants';
import actionTypes from './actionTypes';

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_STATUS: {
      const [prevStatus, curStatus] = action.payload;
      const state1 = incrementValue(state, prevStatus, -1);
      const state2 = incrementValue(state1, curStatus, 1);

      return state2;
    }
    case actionTypes.ADD_STATUS: {
      const curStatus = action.payload;

      return incrementValue(state, curStatus, 1);
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}

function incrementValue(state, status, amount) {
  if (status === UploadStatusTypes.SUCCESS) {
    return { ...state, numSuccessful: checkAmount(state.numSuccessful + amount) };
  }

  if (status === UploadStatusTypes.UPLOADING) {
    return { ...state, numUploading: checkAmount(state.numUploading + amount) };
  }

  if (status === UploadStatusTypes.FAILED) {
    return { ...state, numFailed: checkAmount(state.numFailed + amount) };
  }

  if (status === UploadStatusTypes.CANCELLED) {
    return { ...state, numCancelled: checkAmount(state.numCancelled + amount) };
  }

  throw new Error(`Unknown status type ${status}`);
}

function checkAmount(amount) {
  if (amount < 0) {
    throw new Error('Amount is less than 0');
  }

  return amount;
}
