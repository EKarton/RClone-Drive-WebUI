import { useContext } from 'react';
import { store as defaultStore } from 'contexts/RecentlyViewedImages';
import { actionTypes } from 'contexts/RecentlyViewedImages';

export default function useRecentlyViewedImages(store = defaultStore) {
  const { state, dispatch } = useContext(store);

  return {
    ...state,
    addImage: (fileInfo) => {
      dispatch({ type: actionTypes.ADD_IMAGE, payload: fileInfo });
    },
  };
}
