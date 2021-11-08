import { useContext } from 'react';
import { store } from 'contexts/FileViewerStore';
import { actionTypes } from 'contexts/FileViewerStore';

export default function useFileViewer() {
  const { dispatch } = useContext(store);

  return {
    show: (fileInfo) => {
      dispatch({ type: actionTypes.SET_FILE_INFO, payload: fileInfo });
      dispatch({ type: actionTypes.SHOW_DIALOG });
    },
    hide: () => {
      dispatch({ type: actionTypes.HIDE_DIALOG });
    },
  };
}
