import useFetchData from './useFetchData';
import { useCallback } from 'react';

export default function useFetchRemoteInfo(remote) {
  const func = (c, cancelToken) => c.fetchRemoteInfo(remote, { cancelToken });
  return useFetchData(useCallback(func, [remote]));
}
