import { useCallback } from 'react';
import useFetchData from 'hooks/rclone/fetch-data/useFetchData';

export default function useFetchFiles(remote, path) {
  const func = (c, closeToken) => c.fetchFiles(remote, path, { closeToken });
  return useFetchData(useCallback(func, [remote, path]));
}
