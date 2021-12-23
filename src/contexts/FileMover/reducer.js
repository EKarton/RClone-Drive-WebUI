import { actionTypes } from '.';

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.REQUEST_FILE_MOVE: {
      return {
        ...state,
        isOpen: false,
        fileInfo: action.payload,
      };
    }
    case actionTypes.SHOW_DIALOG: {
      return { ...state, isOpen: true };
    }
    case actionTypes.SET_FILE_INFO: {
      return { ...state, fileInfo: action.payload };
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
