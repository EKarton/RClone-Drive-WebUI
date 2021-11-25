import { useContext } from 'react';
import { store as defaultStore } from 'contexts/FileViewerStore';
import { actionTypes } from 'contexts/FileViewerStore';

export default function useFileViewer(store = defaultStore) {
  const { state, dispatch } = useContext(store);

  return {
    ...state,
    show: (fileInfo) => {
      dispatch({ type: actionTypes.SET_FILE_INFO, payload: fileInfo });
      dispatch({ type: actionTypes.SHOW_DIALOG });
    },
    hide: () => {
      dispatch({ type: actionTypes.HIDE_DIALOG });
    },
  };
}
