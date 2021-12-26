import { useCallback } from 'react';
import useFetchData from 'hooks/rclone/fetch-data/useFetchData';

export default function useFetchFiles(remote, path) {
  const func = (c, cancelToken) => c.fetchFiles(remote, path, { cancelToken });
  return useFetchData(useCallback(func, [remote, path]));
}
