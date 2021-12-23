import actionTypes from './actionTypes';

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.REQUEST_FILE_RENAME: {
      return {
        ...state,
        isOpen: true,
        fileToRename: action.payload,
      };
    }
    case actionTypes.COMPLETE_FILE_RENAME: {
      return {
        ...state,
        isOpen: false,
        fileToRename: undefined,
      };
    }
    case actionTypes.CANCEL_FILE_RENAME: {
      return {
        ...state,
        isOpen: false,
        fileToRename: undefined,
      };
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
