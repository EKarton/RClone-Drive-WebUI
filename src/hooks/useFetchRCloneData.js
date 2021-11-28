import { useEffect, useReducer } from 'react';
import { StatusTypes } from 'utils/constants';
import useRCloneClient from './useRCloneClient';

const useFetchRCloneData = (rCloneClientFn) => {
  const rCloneClient = useRCloneClient();

  const [result, dispatchResult] = useReducer(reducer, {
    status: StatusTypes.LOADING,
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatchResult({ type: StatusTypes.LOADING });

        const data = await rCloneClientFn(rCloneClient);

        dispatchResult({ type: StatusTypes.SUCCESS, payload: data });
      } catch (err) {
        dispatchResult({ type: StatusTypes.ERROR, payload: err });
      }
    };

    fetchData();
  }, [rCloneClient, rCloneClientFn]);

  return result;
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

    case StatusTypes.ERROR:
      return {
        status: StatusTypes.ERROR,
        data: null,
        error: action.payload,
      };

    default:
      throw new Error(`Unknown type ${action.type}`);
  }
}

export default useFetchRCloneData;
