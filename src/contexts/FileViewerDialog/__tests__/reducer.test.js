import actionTypes from '../actionTypes';
import reducer from '../reducer';

describe('reducer', () => {
  it('should set isOpen to false when called HIDE_DIALOG', () => {
    const state = {
      fileInfo: { remote: 'gdrive', folderPath: 'Documents', fileName: 'iamge.png' },
      isOpen: true,
    };

    const newState = reducer(state, { type: actionTypes.HIDE_DIALOG });

    expect(newState).toEqual({
      fileInfo: { remote: 'gdrive', folderPath: 'Documents', fileName: 'iamge.png' },
      isOpen: false,
    });
  });

  it('should set isOpen to false when called SHOW_DIALOG', () => {
    const state = {
      fileInfo: { remote: 'gdrive', folderPath: 'Documents', fileName: 'iamge.png' },
      isOpen: false,
    };

    const newState = reducer(state, { type: actionTypes.SHOW_DIALOG });

    expect(newState).toEqual({
      fileInfo: { remote: 'gdrive', folderPath: 'Documents', fileName: 'iamge.png' },
      isOpen: true,
    });
  });

  it('should set fileInfo correctly when called SET_FILE_INFO', () => {
    const state = {
      fileInfo: { remote: 'gdrive', folderPath: 'Documents', fileName: 'iamge.png' },
      isOpen: false,
    };

    const newFileInfo = {
      remote: 'onedrive',
      folderPath: 'Pictures',
      fileName: 'profile.png',
    };

    const newState = reducer(state, {
      type: actionTypes.SET_FILE_INFO,
      payload: newFileInfo,
    });

    expect(newState).toEqual({
      fileInfo: newFileInfo,
      isOpen: false,
    });
  });

  it('should throw an error when given an invalid type', () => {
    const state = {
      fileInfo: { remote: 'gdrive', folderPath: 'Documents', fileName: 'iamge.png' },
      isOpen: false,
    };

    expect(() => reducer(state, { type: 'randmom string' })).toThrowError();
  });
});
