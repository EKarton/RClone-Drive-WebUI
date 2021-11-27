import { actionTypes } from '.';

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_IMAGE: {
      const { folderPath, fileName, remote } = action.payload;

      const newList = [...state.recentPictures];
      newList.unshift({ folderPath, fileName, remote });

      if (newList.length >= 500) {
        newList.pop();
      }

      return { ...state, recentPictures: newList };
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
