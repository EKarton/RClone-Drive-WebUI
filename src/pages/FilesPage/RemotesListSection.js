import { useHistory } from 'react-router';
import { hashRemotePath } from 'utils/remote-paths-url';
import RemoteCardList from 'components/RemoteCardList';
import { StatusTypes } from 'utils/constants';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';

export default function RemotesListSection() {
  const history = useHistory();
  const { status, data: remotes, error } = useFetchRemotes();

  if (status === StatusTypes.LOADING) {
    return null;
  }

  if (status === StatusTypes.ERROR) {
    return <div>{error.message}</div>;
  }

  const handleRemoteCardClicked = (remote) => {
    history.push(`/files/${hashRemotePath(`${remote}:`)}`);
  };

  return (
    <>
      <h4>Your Remotes</h4>
      <RemoteCardList remotes={remotes} onClick={handleRemoteCardClicked} />
    </>
  );
}
