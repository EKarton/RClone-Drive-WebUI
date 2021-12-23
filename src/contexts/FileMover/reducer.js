import actionTypes from './actionTypes';

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.REQUEST_FILE_MOVE: {
      return {
        ...state,
        isOpen: true,
        fileToMove: action.payload,
      };
    }
    case actionTypes.COMPLETE_FILE_MOVE: {
      return {
        ...state,
        isOpen: false,
        fileToMove: undefined,
      };
    }
    case actionTypes.CANCEL_FILE_MOVE: {
      return {
        ...state,
        isOpen: false,
        fileToMove: undefined,
      };
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
