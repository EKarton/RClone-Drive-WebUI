import { createContext, useEffect, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

const initialState = {
  recentPictures: JSON.parse(localStorage.getItem('recently_viewed_pictures')) || [],
};

console.error(initialState);

const store = createContext(initialState);
const { Provider } = store;

const RecentlyViewedPicturesStateProvider = ({
  children,
  defaultState = initialState,
}) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    const stringedList = JSON.stringify(state.recentPictures);
    localStorage.setItem('recently_viewed_pictures', stringedList);
  }, [state.recentPictures]);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, RecentlyViewedPicturesStateProvider, actionTypes, initialState };
