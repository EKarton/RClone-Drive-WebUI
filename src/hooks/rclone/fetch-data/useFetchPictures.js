import { useCallback } from 'react';
import useFetchData from 'hooks/rclone/fetch-data/useFetchData';

export default function useFetchPictures(remote, path) {
  const func = (c, cancelToken) => c.fetchPictures(remote, path, { cancelToken });
  return useFetchData(useCallback(func, [remote, path]));
}
