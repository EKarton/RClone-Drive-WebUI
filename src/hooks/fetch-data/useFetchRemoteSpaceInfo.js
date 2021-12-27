import { useCallback } from 'react';
import useFetchData from './useFetchData';

export default function useFetchRemoteSpaceInfo(remote) {
  const func = (c, cancelToken) => c.fetchRemoteSpaceInfo(remote, { cancelToken });
  return useFetchData(useCallback(func, [remote]));
}
