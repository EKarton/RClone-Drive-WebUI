import { getFullPath } from 'utils/filename-utils';
import useRCloneClient from '../rclone/useRCloneClient';

export default function useFileCopier() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, dirPath, name } = file;
    const newFileName = `Copy of ${name}`;

    const src = { remote, dirPath, fileName: name };
    const target = { remote, dirPath, fileName: newFileName };

    if (file.isDirectory) {
      const directoryContents = await rCloneClient.fetchFiles(remote, file.path);

      if (directoryContents.length === 0) {
        const newFilePath = getFullPath(dirPath, newFileName);
        await rCloneClient.mkdir(remote, newFilePath);
      } else {
        await rCloneClient.copyDirectoryContents(src, target, true);
      }
    } else {
      await rCloneClient.copyFile(src, target);
    }
  };
}
