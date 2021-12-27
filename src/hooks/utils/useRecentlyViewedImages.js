import { useContext } from 'react';
import { RecentPicturesContext, actionTypes } from 'contexts/RecentPicturesList';

export default function useRecentlyViewedImages(store = RecentPicturesContext) {
  const { state, dispatch } = useContext(store);

  return {
    ...state,
    addImage: (fileInfo) => {
      dispatch({ type: actionTypes.ADD_IMAGE, payload: fileInfo });
    },
  };
}
