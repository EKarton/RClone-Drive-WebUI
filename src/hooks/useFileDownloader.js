import useRCloneClient from 'hooks/rclone/useRCloneClient';
import FileSaver from 'file-saver';

export function useFileDownloader() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, folderPath, name } = file;
    const response = await rCloneClient.fetchFileContents(remote, folderPath, name);

    const mimeType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: mimeType });

    FileSaver.saveAs(blob, name);
  };
}
