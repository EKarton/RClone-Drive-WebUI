import RemoteCardList from 'components/RemoteCardList';
import { StatusTypes } from 'utils/constants';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';

/**
 * Represents the list of remotes in the Pictures page
 */
export default function RemotesListSection({ onRemoteCardClicked }) {
  const { status, data: remotes } = useFetchRemotes();

  if (status === StatusTypes.LOADING) {
    return null;
  }

  if (status === StatusTypes.ERROR) {
    return 'Error!';
  }

  const handleRemoteCardClicked = (remote) => {
    onRemoteCardClicked(remote);
  };

  return (
    <>
      <h4>Your Remotes</h4>
      <RemoteCardList remotes={remotes} onClick={handleRemoteCardClicked} />
    </>
  );
}
