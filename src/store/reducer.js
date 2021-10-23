import { actionTypes } from ".";

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH: {
      return { ...state, auth: action.payload };
    }
    case actionTypes.SET_REMOTES: {
      return { ...state, remotes: action.payload };
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
};

export default reducer;
