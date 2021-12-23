import useRCloneClient from 'hooks/rclone/useRCloneClient';

export function useFileRemover() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    if (file.isDirectory) {
      await rCloneClient.deleteDirectory(file.remote, file.path, file.name);
    } else {
      await rCloneClient.deleteFile(file.remote, file.path, file.name);
    }
  };
}
