import Typography from '@mui/material/Typography';
import RemoteCardList from 'components/RemoteCardList';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import { StatusTypes } from 'utils/constants';
import './RemotesListSection.scss';

/**
 * Represents the list of remotes with header
 */
export default function RemotesListSection({ onRemoteCardClicked }) {
  const { status, data: remotes, error } = useFetchRemotes();

  if (status === StatusTypes.LOADING) {
    return null;
  }

  if (status === StatusTypes.ERROR) {
    throw error;
  }

  const handleRemoteCardClicked = (remote) => {
    onRemoteCardClicked(remote);
  };

  return (
    <>
      <Typography
        variant="h7"
        component="div"
        color="text.primary"
        className="remotes-list-section__header-text"
      >
        Your Remotes
      </Typography>
      <RemoteCardList remotes={remotes} onClick={handleRemoteCardClicked} />
    </>
  );
}
