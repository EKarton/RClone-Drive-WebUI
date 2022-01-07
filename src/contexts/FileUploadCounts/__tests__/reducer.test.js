import { UploadStatusTypes } from 'utils/constants';
import actionTypes from '../actionTypes';
import { InitialState } from '../index';
import reducer from '../reducer';

describe('reducer()', () => {
  const stateWithUploadCount = {
    ...InitialState,
    numUploading: 1,
  };

  it('should update counts correctly given type is ADD_STATUS and new status is UPLOADING', () => {
    const newState = reducer(InitialState, {
      type: actionTypes.ADD_STATUS,
      payload: UploadStatusTypes.UPLOADING,
    });

    expect(newState).toEqual({
      numUploading: 1,
      numSuccessful: 0,
      numFailed: 0,
      numCancelled: 0,
    });
  });

  it('should update counts correctly given type is UPDATE_STATUS and new status is SUCCESS', () => {
    const newState = reducer(stateWithUploadCount, {
      type: actionTypes.UPDATE_STATUS,
      payload: [UploadStatusTypes.UPLOADING, UploadStatusTypes.SUCCESS],
    });

    expect(newState).toEqual({
      numUploading: 0,
      numSuccessful: 1,
      numFailed: 0,
      numCancelled: 0,
    });
  });

  it('should update counts correctly given type is UPDATE_STATUS and new status is FAILED', () => {
    const newState = reducer(stateWithUploadCount, {
      type: actionTypes.UPDATE_STATUS,
      payload: [UploadStatusTypes.UPLOADING, UploadStatusTypes.FAILED],
    });

    expect(newState).toEqual({
      numUploading: 0,
      numSuccessful: 0,
      numFailed: 1,
      numCancelled: 0,
    });
  });

  it('should update counts correctly given type is UPDATE_STATUS and new status is CANCELLED', () => {
    const newState = reducer(stateWithUploadCount, {
      type: actionTypes.UPDATE_STATUS,
      payload: [UploadStatusTypes.UPLOADING, UploadStatusTypes.CANCELLED],
    });

    expect(newState).toEqual({
      numUploading: 0,
      numSuccessful: 0,
      numFailed: 0,
      numCancelled: 1,
    });
  });

  it('should throw an error given type is UPDATE_STATUS and previous status does not exist', () => {
    const updateState = () => {
      reducer(stateWithUploadCount, {
        type: actionTypes.UPDATE_STATUS,
        payload: [UploadStatusTypes.SUCCESS, UploadStatusTypes.CANCELLED],
      });
    };

    expect(updateState).toThrowError();
  });

  it('should throw an error given unknown status type', () => {
    const updateState = () => {
      reducer(InitialState, { type: actionTypes.ADD_STATUS, payload: 'Random' });
    };

    expect(updateState).toThrowError();
  });

  it('should throw an error given unknown action type', () => {
    const updateState = () => {
      reducer(InitialState, { type: 'Random', payload: 'Random' });
    };

    expect(updateState).toThrowError();
  });
});
