import FileSaver from 'file-saver';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

export default function useFileDownloader() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, folderPath, name } = file;
    const response = await rCloneClient.fetchFileContents(remote, folderPath, name);

    const mimeType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: mimeType });

    FileSaver.saveAs(blob, name);
  };
}
