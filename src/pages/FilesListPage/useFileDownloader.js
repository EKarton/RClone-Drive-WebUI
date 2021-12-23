import useRCloneClient from 'hooks/rclone/useRCloneClient';
import FileSaver from 'file-saver';

export function useFileDownloader() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, path, name } = file;
    const response = await rCloneClient.fetchFileContents(remote, path, name);

    const mimeType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: mimeType });

    FileSaver.saveAs(blob, name);
  };
}
