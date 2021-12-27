import actionTypes from '../actionTypes';
import reducer from '../reducer';

describe('reducer()', () => {
  it('should add an image to the front of the list when adding a new image', () => {
    const state = {
      recentPictures: [
        { folderPath: 'Pictures', fileName: 'dog.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cat.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cow.png', remote: 'gdrive' },
      ],
    };

    const newImage = { folderPath: 'Pictures', fileName: 'lizard.png', remote: 'gdrive' };
    const newState = reducer(state, { type: actionTypes.ADD_IMAGE, payload: newImage });

    expect(newState).toEqual({
      recentPictures: [
        { folderPath: 'Pictures', fileName: 'lizard.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'dog.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cat.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cow.png', remote: 'gdrive' },
      ],
    });
  });

  it('should remove the image and add the image to the front of the list when adding a duplicate image', () => {
    const state = {
      recentPictures: [
        { folderPath: 'Pictures', fileName: 'dog.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cat.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cow.png', remote: 'gdrive' },
      ],
    };

    const newImage = { folderPath: 'Pictures', fileName: 'cat.png', remote: 'gdrive' };
    const newState = reducer(state, { type: actionTypes.ADD_IMAGE, payload: newImage });

    expect(newState).toEqual({
      recentPictures: [
        { folderPath: 'Pictures', fileName: 'cat.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'dog.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cow.png', remote: 'gdrive' },
      ],
    });
  });

  it('should remove the 501th image when adding a new image', () => {
    const state = {
      recentPictures: Array.from({ length: 500 }, () => ({
        folderPath: 'Pictures',
        fileName: 'dog.png',
        remote: 'gdrive',
      })),
    };

    const newImage = { folderPath: 'Pictures', fileName: 'cat.png', remote: 'gdrive' };
    const newState = reducer(state, { type: actionTypes.ADD_IMAGE, payload: newImage });

    expect(newState.recentPictures.length).toEqual(500);
  });

  it('should throw an error given unknown type', () => {
    const state = {
      recentPictures: [
        { folderPath: 'Pictures', fileName: 'dog.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cat.png', remote: 'gdrive' },
        { folderPath: 'Pictures', fileName: 'cow.png', remote: 'gdrive' },
      ],
    };

    expect(() => reducer(state, { type: 'random type' })).toThrowError();
  });
});
