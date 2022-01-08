import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import { StatusTypes } from 'utils/constants';
import RemotesList from './RemotesList';
import RemotesListSkeleton from './RemotesListSkeleton';

/**
 * Represents the list of remotes with header
 */
export default function RemotesListSection({ onRemoteCardClicked }) {
  const { status, data: remotes, error } = useFetchRemotes();

  if (status === StatusTypes.ERROR) {
    throw error;
  }

  const renderList = () => {
    if (status === StatusTypes.LOADING) {
      return <RemotesListSkeleton />;
    }

    return <RemotesList remotes={remotes} onRemoteCardClicked={onRemoteCardClicked} />;
  };

  return (
    <>
      <Typography variant="h7" component="div" color="text.primary">
        <strong>Your Remotes</strong>
      </Typography>
      {renderList()}
    </>
  );
}

RemotesListSection.propTypes = {
  onRemoteCardClicked: PropTypes.func,
};
