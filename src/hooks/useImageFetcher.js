import LRUCache from 'lru-cache';
import ImageFetcher from 'utils/ImageFetcher';
import useRCloneClient from './useRCloneClient';

let imageFetcher = null;

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
