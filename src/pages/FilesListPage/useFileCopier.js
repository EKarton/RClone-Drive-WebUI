import useRCloneClient from 'hooks/rclone/useRCloneClient';

export function useFileCopier() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, path, name } = file;
    const newFileName = `Copy of ${name}`;

    const src = { remote, folderPath: path, name };
    const target = { remote, folderPath: path, fileName: newFileName };

    await rCloneClient.copyFile(src, target);
  };
}
