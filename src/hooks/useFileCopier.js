import useRCloneClient from 'hooks/rclone/useRCloneClient';

export function useFileCopier() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, folderPath, name } = file;
    const newFileName = `Copy of ${name}`;

    const src = { remote, folderPath: folderPath, name };
    const target = { remote, folderPath: folderPath, fileName: newFileName };

    await rCloneClient.copyFile(src, target);
  };
}
