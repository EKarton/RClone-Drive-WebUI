import { useParams } from 'react-router';
import { unhashRemotePath } from 'utils/remote-paths-url';

export default function useRemotePathParams() {
  const { id } = useParams();
  const remotePath = unhashRemotePath(id);
  const [remote, path] = remotePath.split(':');

  return { remote, path };
}
