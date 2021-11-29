import { useCallback } from 'react';
import { useHistory } from 'react-router';
import useFetchRCloneData from 'hooks/useFetchRCloneData';
import { hashRemotePath } from 'utils/remote-paths-url';
import RemoteCardList from 'components/RemoteCardList';
import { StatusTypes } from 'utils/constants';

export default function RemotesListSection() {
  const history = useHistory();
  const fetchRemotes = useCallback((c) => c.fetchRemotes(), []);
  const remotesResult = useFetchRCloneData(fetchRemotes);

  if (remotesResult.status === StatusTypes.LOADING) {
    return null;
  }

  if (remotesResult.status === StatusTypes.ERROR) {
    return <div>{remotesResult.error.message}</div>;
  }

  const handleRemoteCardClicked = (remote) => {
    history.push(`/files/${hashRemotePath(`${remote}:`)}`);
  };

  return (
    <>
      <h4>Your Remotes</h4>
      <RemoteCardList remotes={remotesResult.data} onClick={handleRemoteCardClicked} />
    </>
  );
}
