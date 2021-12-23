import useRCloneClient from 'hooks/rclone/useRCloneClient';
import RenameFileDialog from 'pages/FilesListPage/RenameFileDialog';
import { createContext, useContext, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

export const initialState = {
  fileToRename: undefined,
  isOpen: false,
};

export const store = createContext(initialState);

export const useRenameFileDialog = () => {
  const { dispatch } = useContext(store);

  const renameFile = (file) => {
    dispatch({ type: actionTypes.REQUEST_FILE_RENAME, payload: file });
  };

  return { renameFile };
};

export const FileRenamerProvider = ({ children, defaultState = initialState }) => {
  const { Provider } = store;
  const [state, dispatch] = useReducer(reducer, defaultState);
  const rCloneClient = useRCloneClient();

  const handleOk = async (newFileName) => {
    const { remote, folderPath, name: oldFileName, isDirectory } = state.fileToRename;

    const src = { remote, folderPath, fileName: oldFileName };
    const target = { remote, folderPath, fileName: newFileName };

    if (isDirectory) {
      await rCloneClient.move(src, target, true);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    dispatch({ type: actionTypes.COMPLETE_FILE_RENAME });
  };

  const handleCancel = () => {
    dispatch({ type: actionTypes.CANCEL_FILE_RENAME });
  };

  return (
    <Provider value={{ state, dispatch }}>
      <RenameFileDialog
        open={state.isOpen}
        fileName={state.fileToRename?.name}
        onCancel={handleCancel}
        onRename={handleOk}
      />
      {children}
    </Provider>
  );
};

export * from './actionTypes';
