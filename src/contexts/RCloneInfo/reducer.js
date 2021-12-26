import { actionTypes } from '.';

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_ENDPOINT: {
      return { ...state, endpoint: action.payload };
    }
    case actionTypes.SET_USERNAME: {
      return { ...state, username: action.payload };
    }
    case actionTypes.SET_PASSWORD: {
      return { ...state, password: action.payload };
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
