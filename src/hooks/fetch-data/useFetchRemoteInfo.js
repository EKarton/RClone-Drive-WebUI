import { useCallback } from 'react';
import useFetchData from './useFetchData';

export default function useFetchRemoteInfo(remote) {
  const func = (c, cancelToken) => c.fetchRemoteInfo(remote, { cancelToken });
  return useFetchData(useCallback(func, [remote]));
}
