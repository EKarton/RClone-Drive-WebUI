import { useContext } from 'react';
import { store as defaultStore } from 'contexts/FileViewerStore';
import { actionTypes } from 'contexts/FileViewerStore';

/**
 * A custom hook used to interface with the file viewer
 * It allows you to:
 * - Open the file viewer
 * - Hide the file viewer
 * - Get the state of the file viewer
 *
 * It returns an object with this shape:
 * {
 *    fileInfo?: {
 *      remote?: string,
 *      folderPath?: string,
 *      fileName?: string,
 *    },
 *    isOpen: boolean,
 *    show: (object) => {...},
 *    hide: () => {...}
 * }
 *
 * @param {React.Context} store the React Context store for the file viewer
 * @returns {object} the object with the shape above
 */
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
