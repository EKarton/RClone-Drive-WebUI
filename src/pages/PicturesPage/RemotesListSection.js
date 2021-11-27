import { useCallback } from 'react';
import RemoteCardList from 'components/RemoteCardList';
import useFetchRCloneData from 'hooks/useFetchRCloneData';
import { StatusTypes } from 'utils/constants';

export default function RemotesListSection({ onRemoteCardClicked }) {
  const fetchRemotes = useCallback((c) => c.fetchRemotes(), []);
  const remotesResult = useFetchRCloneData(fetchRemotes);

  if (remotesResult.status === StatusTypes.LOADING) {
    return null;
  }

  if (remotesResult.status === StatusTypes.ERROR) {
    return null;
  }

  const handleRemoteCardClicked = (remote) => {
    onRemoteCardClicked(remote);
  };

  return (
    <>
      <h4>Your Remotes</h4>
      <RemoteCardList remotes={remotesResult.data} onClick={handleRemoteCardClicked} />
    </>
  );
}
