import { getFullPath, getNewFilename, getNewFolderName } from 'utils/filename-utils';

describe('getFullPath()', () => {
  it('should return correct full path given no directory path', () => {
    expect(getFullPath('', 'dog.png')).toEqual('dog.png');
  });

  it('should return correct full path given a directory path', () => {
    expect(getFullPath('Pictures', 'dog.png')).toEqual('Pictures/dog.png');
  });

  it('should return correct full path given no file name', () => {
    expect(getFullPath('Pictures')).toEqual('Pictures');
  });
});

describe('getNewFileName()', () => {
  it('should return a file name that is not an existing file name', () => {
    const existingFolderNames = ['Copy of dog.png', 'Copy of Copy of dog.png'];

    const newFileName = getNewFilename('dog.png', existingFolderNames);

    expect(newFileName).toEqual('Copy of Copy of Copy of dog.png');
  });
});

describe('getNewFolderName()', () => {
  it('should return new folder name that is not an existing folder name', () => {
    const existingFolderNames = ['New Folder', 'New Folder 1', 'New Folder 2'];

    expect(getNewFolderName(existingFolderNames)).toEqual('New Folder 3');
  });
});
