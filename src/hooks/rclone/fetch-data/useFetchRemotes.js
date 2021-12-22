import { useCallback } from 'react';
import useFetchData from 'hooks/rclone/fetch-data/useFetchData';

export default function useFetchRemotes() {
  const func = (c, cancelToken) => c.fetchRemotes({ cancelToken });
  return useFetchData(useCallback(func, []));
}
