import { useContext } from 'react';
import { actionTypes } from 'contexts/RCloneInfo';
import { RCloneInfoContext } from 'contexts/RCloneInfo';

/**
 * Returns the RClone info
 *
 * It will return an object with this shape:
 * {
 *    rCloneInfo: {
 *      endpoint?: string,
 *      username?: string,
 *      password?: string,
 *    },
 *    setRCloneInfo: (object) => {}
 *    clearRCloneInfo: () => {}
 * }
 *
 * @param {React.Context} store the React Context store (used for testing only)
 * @returns {object} the object with the shape above
 */
export default function useRCloneInfo(store = RCloneInfoContext) {
  const { state, dispatch } = useContext(store);

  const setRCloneInfo = (newInfo) => {
    dispatch({ type: actionTypes.SET_ENDPOINT, payload: newInfo.endpoint });
    dispatch({ type: actionTypes.SET_USERNAME, payload: newInfo.username });
    dispatch({ type: actionTypes.SET_PASSWORD, payload: newInfo.password });
  };

  const clearRCloneInfo = () => {
    dispatch({ type: actionTypes.SET_ENDPOINT, payload: undefined });
    dispatch({ type: actionTypes.SET_USERNAME, payload: undefined });
    dispatch({ type: actionTypes.SET_PASSWORD, payload: undefined });
  };

  return {
    rCloneInfo: state,
    setRCloneInfo,
    clearRCloneInfo,
  };
}
