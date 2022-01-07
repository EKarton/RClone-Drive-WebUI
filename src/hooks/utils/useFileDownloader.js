import FileSaver from 'file-saver';
import useRCloneClient from '../rclone/useRCloneClient';

export default function useFileDownloader() {
  const rCloneClient = useRCloneClient();

  return async (file) => {
    const { remote, dirPath, name } = file;
    const response = await rCloneClient.fetchFileContents(remote, dirPath, name);

    const mimeType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: mimeType });

    FileSaver.saveAs(blob, name);
  };
}
