import { getFullPath } from 'utils/filename-utils';

export default async function getExistingPictures(
  recentPictures,
  rCloneClient,
  cancelToken = undefined,
  maxLength = 6
) {
  const existingPictures = [];

  let i = 0;
  while (i < recentPictures.length && existingPictures.length < maxLength) {
    const picturesToCheck = [];

    for (let j = i; j < Math.min(i + maxLength, recentPictures.length); j++) {
      picturesToCheck.push(recentPictures[j]);
    }

    const doPicturesExist = await Promise.all(
      picturesToCheck.map(async (picture) => {
        const { remote, dirPath, fileName } = picture;
        const path = getFullPath(dirPath, fileName);

        try {
          const opts = { cancelToken };
          await rCloneClient.fetchFullPathInfo(remote, path, opts);
          return true;
        } catch (err) {
          return false;
        }
      })
    );

    for (let j = 0; j < picturesToCheck.length; j++) {
      if (doPicturesExist[j]) {
        existingPictures.push(picturesToCheck[j]);
      }
    }

    i += maxLength;
  }

  return existingPictures;
}
