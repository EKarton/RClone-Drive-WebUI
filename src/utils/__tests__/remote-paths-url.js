import { hashRemotePath, unhashRemotePath } from 'utils/remote-paths-url';

describe('hashRemotePath()', () => {
  it('should return correct base 64 of a remote full path', () => {
    const remoteFullPath = 'gdrive:Pictures/2021';

    expect(hashRemotePath(remoteFullPath)).toEqual('Z2RyaXZlOlBpY3R1cmVzLzIwMjE=');
  });

  it('should return correct folder path given base 64 of a remote full path', () => {
    const remoteFullPath = 'Z2RyaXZlOlBpY3R1cmVzLzIwMjE=';

    expect(unhashRemotePath(remoteFullPath)).toEqual('gdrive:Pictures/2021');
  });
});
