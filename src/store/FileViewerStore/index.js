import { createContext, useReducer } from "react";
import actionTypes from "./actionTypes";
import reducer from "./reducer";

const initialState = {
  fileInfo: undefined,
  isOpen: false,
};

const store = createContext(initialState);
const { Provider } = store;

const FileViewerProvider = ({ children, defaultState }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, FileViewerProvider, actionTypes, initialState };
