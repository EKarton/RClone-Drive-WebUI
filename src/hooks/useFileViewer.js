import { useContext } from "react";
import { store } from "store/FileViewerStore";
import { actionTypes } from "store/FileViewerStore";

export default function useFileViewer() {
  const { dispatch } = useContext(store);

  return {
    show: (fileInfo) => {
      dispatch({ type: actionTypes.SHOW_DIALOG });
      dispatch({ type: actionTypes.SET_FILE_INFO, payload: fileInfo });
    },
    hide: () => {
      dispatch({ type: actionTypes.HIDE_DIALOG });
    },
  };
}
