import FileUploader from 'utils/FileUploader';
import useRCloneClient from './useRCloneClient';

let fileUploader = null;

/**
 * A custom hook used to get the singleton of the ImageFetcher
 * If the ImageFetcher is not made yet, it will always create an instance of the ImageFetcher
 * If the ImageFetcher was made already, it will use the existing instance
 *
 * @returns {ImageFetcher} the image fetcher
 */
export default function useFileUploader() {
  const rCloneClient = useRCloneClient();

  if (fileUploader) {
    return fileUploader;
  }

  fileUploader = new FileUploader(rCloneClient);
  return fileUploader;
}
