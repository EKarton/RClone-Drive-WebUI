import { useContext, useEffect } from "react";
import { actionTypes } from "store/RCloneInfoStore";
import { store } from "store/RCloneInfoStore";

export default function useRCloneInfo() {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    const syncData = (field, dispatchType) => {
      const stateValue = state[field];
      const cachedValue = localStorage.getItem(field);

      if (stateValue && !cachedValue) {
        localStorage.setItem(field, stateValue);
      }

      if (!stateValue && cachedValue) {
        dispatch({ type: dispatchType, payload: cachedValue });
      }
    };

    if (state) {
      syncData("endpoint", actionTypes.SET_ENDPOINT);
      syncData("username", actionTypes.SET_USERNAME);
      syncData("password", actionTypes.SET_PASSWORD);
    }
  }, [dispatch, state]);

  const setInfo = (dispatchType, localStorageKey, newValue) => {
    localStorage.setItem(localStorageKey, newValue);
    dispatch({ type: dispatchType, payload: newValue });
  };

  const setRCloneInfo = (newInfo) => {
    setInfo(actionTypes.SET_ENDPOINT, "endpoint", newInfo.endpoint);
    setInfo(actionTypes.SET_USERNAME, "username", newInfo.username);
    setInfo(actionTypes.SET_PASSWORD, "password", newInfo.password);
  };

  const getValue = (key) => {
    return state?.[key] || localStorage.getItem(key);
  };

  return {
    rCloneInfo: {
      endpoint: getValue("endpoint"),
      username: getValue("username"),
      password: getValue("password"),
    },
    setRCloneInfo,
  };
}
