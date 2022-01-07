import useRCloneClient from '../rclone/useRCloneClient';

export default function useFileRemover() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    if (file.isDirectory) {
      await rCloneClient.deleteDirectory(file.remote, file.dirPath, file.name);
    } else {
      await rCloneClient.deleteFile(file.remote, file.dirPath, file.name);
    }
  };
}
