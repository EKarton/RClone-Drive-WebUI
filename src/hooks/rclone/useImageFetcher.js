import LRUCache from 'lru-cache';
import ImageFetcher from 'services/ImageFetcher';
import useRCloneClient from './useRCloneClient';

let imageFetcher = null;

/**
 * A custom hook used to get the singleton of the ImageFetcher
 * If the ImageFetcher is not made yet, it will always create an instance of the ImageFetcher
 * If the ImageFetcher was made already, it will use the existing instance
 *
 * @returns {ImageFetcher} the image fetcher
 */
export default function useImageFetcher() {
  const rCloneClient = useRCloneClient();

  if (imageFetcher) {
    return imageFetcher;
  }

  const lruCache = new LRUCache({
    max: 100,
  });

  imageFetcher = new ImageFetcher(rCloneClient, lruCache);
  return imageFetcher;
}
