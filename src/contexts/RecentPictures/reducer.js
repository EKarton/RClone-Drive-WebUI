import { actionTypes } from '.';

export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_IMAGE: {
      const { folderPath, fileName, remote } = action.payload;

      const newList = [...state.recentPictures];

      // Check if the same image is in the list, and if so, remove it
      const existingItemIdx = newList.findIndex((img) => {
        return (
          img.folderPath === folderPath &&
          img.fileName === fileName &&
          img.remote === remote
        );
      });

      if (existingItemIdx !== -1) {
        newList.splice(existingItemIdx, 1);
      }

      // Add the new image to the front of the list
      newList.unshift({ folderPath, fileName, remote });

      // Pop old images
      if (newList.length > 500) {
        newList.pop();
      }

      return { ...state, recentPictures: newList };
    }
    case actionTypes.REMOVE_IMAGES: {
      const remotePaths = action.payload.map(({ remote, folderPath, fileName }) => {
        return `${remote}:${folderPath}/${fileName}`;
      });

      const remotePathsSet = new Set(remotePaths);

      const newList = state.recentPictures.filter((file) => {
        const { remote, folderPath, fileName } = file;
        const remotePathStr = `${remote}:${folderPath}/${fileName}`;

        if (remotePathsSet.has(remotePathStr)) {
          return false;
        }
        return true;
      });

      return { ...state, recentPictures: newList };
    }
    default:
      throw new Error(`Unknown action ${action.type}`);
  }
}
