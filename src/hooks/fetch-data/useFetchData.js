import axios from 'axios';
import { useCallback, useEffect, useReducer } from 'react';
import { StatusTypes } from 'utils/constants';
import useRCloneClient from '../rclone/useRCloneClient';

/**
 * A custom hook used to get information from RClone
 * Note:
 * - You should only use these for READ operations, not WRITE operations
 * - You should wrap the rCloneClientFn in a useCallback() function to
 *   prevent an infinite loop of re-renders
 *
 * The rCloneClientFn function passes an instance of the RCloneClient
 * in the parameters
 *
 * It returns an object with this shape:
 * {
 *    status: StatusTypes.LOADING | StatusTypes.SUCCESS | StatusTypes.ERROR,
 *    data?: any
 *    error?: Error
 * }
 *
 * @param {Function} rCloneClientFn a callback function
 * @returns {object} the result with the shape above
 */
const useFetchData = (rCloneClientFn) => {
  const rCloneClient = useRCloneClient();

  const [result, dispatchResult] = useReducer(reducer, {
    status: StatusTypes.LOADING,
    data: null,
    error: null,
  });

  const fetchData = useCallback(
    async (cancelToken) => {
      try {
        dispatchResult({ type: StatusTypes.LOADING });

        const data = await rCloneClientFn(rCloneClient, cancelToken);

        dispatchResult({ type: StatusTypes.SUCCESS, payload: data });
      } catch (err) {
        if (!axios.isCancel(err)) {
          dispatchResult({ type: StatusTypes.ERROR, payload: err });
        }
      }
    },
    [rCloneClient, rCloneClientFn]
  );

  useEffect(() => {
    const cancelSource = axios.CancelToken.source();

    fetchData(cancelSource.token);

    return () => {
      cancelSource.cancel();
    };
  }, [fetchData, rCloneClient, rCloneClientFn]);

  return {
    ...result,
    refetchData: fetchData,
  };
};

function reducer(_state, action) {
  switch (action.type) {
    case StatusTypes.LOADING:
      return {
        status: StatusTypes.LOADING,
        data: null,
        error: null,
      };

    case StatusTypes.SUCCESS:
      return {
        status: StatusTypes.SUCCESS,
        data: action.payload,
        error: null,
      };

    default:
      return {
        status: StatusTypes.ERROR,
        data: null,
        error: action.payload,
      };
  }
}

export default useFetchData;
