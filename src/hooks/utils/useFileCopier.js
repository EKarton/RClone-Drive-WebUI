import { getFullPath } from 'utils/filename-utils';
import useRCloneClient from '../rclone/useRCloneClient';

export default function useFileCopier() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, folderPath, name } = file;
    const newFileName = `Copy of ${name}`;

    const src = { remote, folderPath, fileName: name };
    const target = { remote, folderPath, fileName: newFileName };

    if (file.isDirectory) {
      const directoryContents = await rCloneClient.fetchFiles(remote, file.path);

      if (directoryContents.length === 0) {
        const newFilePath = getFullPath(folderPath, newFileName);
        await rCloneClient.mkdir(remote, newFilePath);
      } else {
        await rCloneClient.copyDirectoryContents(src, target, true);
      }
    } else {
      await rCloneClient.copyFile(src, target);
    }
  };
}
