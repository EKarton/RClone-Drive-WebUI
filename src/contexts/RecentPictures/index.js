import { createContext, useEffect, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

export const InitialState = {
  recentPictures: JSON.parse(localStorage.getItem('recently_viewed_pictures')) || [],
};

export const RecentPicturesContext = createContext(InitialState);

export const RecentPicturesProvider = ({ children, defaultState = InitialState }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    const stringedList = JSON.stringify(state.recentPictures);
    localStorage.setItem('recently_viewed_pictures', stringedList);
  }, [state.recentPictures]);

  return (
    <RecentPicturesContext.Provider value={{ state, dispatch }}>
      {children}
    </RecentPicturesContext.Provider>
  );
};

export { actionTypes };
