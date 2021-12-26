import useFetchData from './useFetchData';
import { useCallback } from 'react';

export default function useFetchRemoteSpaceInfo(remote) {
  const func = (c, cancelToken) => c.fetchRemoteSpaceInfo(remote, { cancelToken });
  return useFetchData(useCallback(func, [remote]));
}
