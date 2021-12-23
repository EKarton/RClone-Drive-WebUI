import useRCloneClient from 'hooks/rclone/useRCloneClient';
import MoveFileDialog from 'pages/FilesListPage/MoveFileDialog';
import { createContext, useContext, useReducer } from 'react';
import actionTypes from './actionTypes';
import reducer from './reducer';

export const initialState = {
  fileToMove: undefined,
  isOpen: false,
};

export const store = createContext(initialState);

export const useMoveFileDialog = () => {
  const { dispatch } = useContext(store);

  const moveFile = (file) => {
    dispatch({ type: actionTypes.REQUEST_FILE_MOVE, payload: file });
  };

  return { moveFile };
};

export const FileMoverProvider = ({ children, defaultState = initialState }) => {
  const { Provider } = store;
  const [state, dispatch] = useReducer(reducer, defaultState);
  const rCloneClient = useRCloneClient();

  const handleOk = async (remoteFolderPath) => {
    const [newRemote, newFolderPath] = remoteFolderPath.split(':');

    const src = {
      remote: state.fileToMove.remote,
      folderPath: state.fileToMove.folderPath,
      fileName: state.fileToMove.name,
    };

    const target = {
      remote: newRemote,
      folderPath: newFolderPath,
      fileName: state.fileToMove.name,
    };

    if (state.fileToMove.isDirectory) {
      await rCloneClient.move(src, target, true, false);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    dispatch({ type: actionTypes.COMPLETE_FILE_MOVE });
  };

  const handleCancel = () => {
    dispatch({ type: actionTypes.CANCEL_FILE_MOVE });
  };

  return (
    <Provider value={{ state, dispatch }}>
      <MoveFileDialog open={state.isOpen} onCancel={handleCancel} onOk={handleOk} />
      {children}
    </Provider>
  );
};

export * from './actionTypes';
