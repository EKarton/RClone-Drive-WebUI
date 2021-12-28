import { useParams } from 'react-router';
import { unhashRemotePath } from 'utils/remote-paths-url';

/**
 * A custom hook used to get and parse the path params that were encoded in Base64
 * The params should be the Base64 of <remote>:<path>
 *
 * It returns an object with the shape below:
 * {
 *   remote: string,
 *   path: string
 * }
 *
 * @returns {object} the object with the shape above
 */
export default function useRemotePathParams() {
  const { id } = useParams();

  try {
    const remotePath = unhashRemotePath(id);
    const [remote, path] = remotePath.split(':');

    if (remote === undefined || path === undefined) {
      throw new Error('Cannot find remote or path');
    }

    return { remote, path };
  } catch (err) {
    throw new InvalidRemotePathError(id);
  }
}

export class InvalidRemotePathError extends Error {
  constructor(path) {
    super(`Invalid path ${path}`);
    this.path = path;
  }
}
