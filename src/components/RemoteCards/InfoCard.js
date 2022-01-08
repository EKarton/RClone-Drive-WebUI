import Skeleton from '@mui/material/Skeleton';
import prettyBytes from 'pretty-bytes';
import PropTypes from 'prop-types';
import useFetchRemoteInfo from 'hooks/fetch-data/useFetchRemoteInfo';
import useFetchRemoteSpaceInfo from 'hooks/fetch-data/useFetchRemoteSpaceInfo';
import { StatusTypes } from 'utils/constants';
import BaseCard from './BaseCard';

export default function InfoCard({ remote, onClick }) {
  const sizeResult = useFetchRemoteSpaceInfo(remote);
  const infoResult = useFetchRemoteInfo(remote);

  const renderRemoteInfo = () => {
    if (infoResult.status === StatusTypes.LOADING) {
      return <Skeleton data-testid="remote-info-skeleton" />;
    }

    if (infoResult.status === StatusTypes.ERROR) {
      return 'Unable to get remote details';
    }

    return `Type: ${infoResult.data?.type}`;
  };

  const renderSpaceUsed = () => {
    if (sizeResult.status === StatusTypes.LOADING) {
      return <Skeleton data-testid="remote-space-skeleton" />;
    }

    if (sizeResult.status === StatusTypes.ERROR) {
      return 'Unable to get space information';
    }

    const totalSpace = prettyBytes(sizeResult.data?.total);
    const spaceUsed = prettyBytes(sizeResult.data?.used);

    return `${spaceUsed} / ${totalSpace} used`;
  };

  return (
    <BaseCard
      remoteName={remote}
      remoteType={renderRemoteInfo()}
      remoteSpace={renderSpaceUsed()}
      onClick={onClick}
    />
  );
}

InfoCard.propTypes = {
  remote: PropTypes.string,
  onClick: PropTypes.func,
};
