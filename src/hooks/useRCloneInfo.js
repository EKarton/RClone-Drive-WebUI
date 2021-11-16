import { useContext } from 'react';
import { actionTypes } from 'contexts/RCloneInfoStore';
import { store as defaultStore } from 'contexts/RCloneInfoStore';

export default function useRCloneInfo(store = defaultStore) {
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
