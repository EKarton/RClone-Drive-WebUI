import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import RemoteCardList from 'components/RemoteCardList';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import { StatusTypes } from 'utils/constants';

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
      <Typography variant="h7" component="div" color="text.primary">
        <strong>Your Remotes</strong>
      </Typography>
      <RemoteCardList remotes={remotes} onClick={handleRemoteCardClicked} />
    </>
  );
}

RemotesListSection.propTypes = {
  onRemoteCardClicked: PropTypes.func,
};
