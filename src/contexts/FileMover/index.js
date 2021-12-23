import MoveFileDialog from 'pages/FilesListPage/MoveFileDialog';
import { createContext, useReducer } from 'react';
import reducer from './reducer';

export const initialState = {
  fileInfo: {
    remote: undefined,
    folderPath: undefined,
    fileName: undefined,
  },
  isOpen: false,
};

export const store = createContext(initialState);

export const actionTypes = Object.freeze({
  REQUEST_FILE_MOVE: 'REQUEST_FILE_MOVE',
  CANCEL_FILE_MOVE: 'CANCEL_FILE_MOVE',
});

export const FileMoverProvider = ({ children, defaultState = initialState }) => {
  const { Provider } = store;
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <Provider value={{ state, dispatch }}>
      <MoveFileDialog />
      {children}
    </Provider>
  );
};
