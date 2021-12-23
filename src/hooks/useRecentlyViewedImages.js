import { useContext } from 'react';
import { store as defaultStore } from 'contexts/RecentPictures';
import { actionTypes } from 'contexts/RecentPictures';

export default function useRecentlyViewedImages(store = defaultStore) {
  const { state, dispatch } = useContext(store);

  return {
    ...state,
    addImage: (fileInfo) => {
      dispatch({ type: actionTypes.ADD_IMAGE, payload: fileInfo });
    },
    removeImages: (files) => {
      dispatch({ type: actionTypes.REMOVE_IMAGES, payload: files });
    },
  };
}
