import getExistingPictures from '../getExistingPictures';

describe('getExistingPictures', () => {
  // Generate pictures with names 0.png, 1.png, 2.png, ..., 19.png
  const recentPictures = Array.from({ length: 20 }).map((_, i) => ({
    remote: 'drive',
    dirPath: 'Pictures',
    fileName: `${i}.jpg`,
  }));

  it('should return 6 images and make at most 6 api calls given first 7 pictures exist', async () => {
    const rCloneClient = createMockRCloneClient([0, 1, 2, 3, 4, 5, 6]);

    const results = await getExistingPictures(recentPictures, rCloneClient);

    expect(results.length).toEqual(6);
    expect(rCloneClient.fetchFullPathInfo).toBeCalledTimes(6);
  });

  it('should make at most 12 api calls given the 6th pictures exist in the 12th picture', async () => {
    const rCloneClient = createMockRCloneClient([0, 1, 2, 3, 4, 11]);

    const results = await getExistingPictures(recentPictures, rCloneClient);

    expect(results.length).toEqual(6);
    expect(rCloneClient.fetchFullPathInfo).toBeCalledTimes(12);
  });

  it('should make all api calls and return an empty array given no existing pictures exist', async () => {
    const rCloneClient = createMockRCloneClient([]);

    const results = await getExistingPictures(recentPictures, rCloneClient);

    expect(results).toEqual([]);
    expect(rCloneClient.fetchFullPathInfo).toBeCalledTimes(recentPictures.length);
  });

  it('should return an empty array given no existing pictures', async () => {
    const rCloneClient = createMockRCloneClient([]);

    const results = await getExistingPictures([], rCloneClient);

    expect(results).toEqual([]);
    expect(rCloneClient.fetchFullPathInfo).not.toBeCalled();
  });

  const createMockRCloneClient = (existingPictures) => {
    const existingPicturesSet = new Set(existingPictures);

    const rCloneClient = {
      fetchFullPathInfo: jest.fn().mockImplementation((_remote, path) => {
        const [, fileName] = path.split('/');
        const imageNum = parseInt(fileName.split('.')[0]);

        if (!existingPicturesSet.has(imageNum)) {
          throw new Error('Cannot find picture');
        }

        return {};
      }),
    };

    return rCloneClient;
  };
});
