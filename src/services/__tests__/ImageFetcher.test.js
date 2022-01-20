import ImageFetcher from '../ImageFetcher';

describe('ImageFetcher', () => {
  describe('getImage()', () => {
    const mockCache = {
      has: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
    };

    const mockRCloneClient = {
      fetchFileContents: jest.fn(),
    };

    it('should call rclone client and store it in cache given image is not in cache', async () => {
      mockCache.has.mockReturnValue(false);
      mockRCloneClient.fetchFileContents.mockReturnValue('1234');

      const imageFetcher = new ImageFetcher(mockRCloneClient, mockCache);
      const image = await imageFetcher.getImage('gdrive', 'Pictures', 'dog.png');

      expect(image).toEqual('1234');
      expect(mockCache.set).toBeCalledWith('gdrive:Pictures/dog.png', '1234');
    });

    it('should not call rclone client given image is in cache', async () => {
      mockCache.has.mockReturnValue(true);
      mockCache.get.mockReturnValue('1234');

      const imageFetcher = new ImageFetcher(mockRCloneClient, mockCache);
      const image = await imageFetcher.getImage('gdrive', 'Pictures', 'dog.png');

      expect(image).toEqual('1234');
      expect(mockRCloneClient.fetchFileContents).not.toBeCalled();
    });
  });
});
