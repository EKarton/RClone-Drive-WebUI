import { Card, CardContent, Skeleton, Typography, CardActionArea } from '@mui/material';
import { StatusTypes } from 'utils/constants';
import prettyBytes from 'pretty-bytes';
import './RemoteCard.scss';
import useFetchRCloneData from 'hooks/useFetchRCloneData';
import { useCallback } from 'react';

export default function RemoteCard({ remote, onClick, ...props }) {
  const fetchSpace = useCallback((c) => c.fetchRemoteSpaceInfo(remote), [remote]);
  const fetchInfo = useCallback((c) => c.fetchRemoteInfo(remote), [remote]);

  const sizeResult = useFetchRCloneData(fetchSpace);
  const infoResult = useFetchRCloneData(fetchInfo);

  const renderRemoteInfo = () => {
    if (infoResult.status === StatusTypes.LOADING) {
      return <Skeleton />;
    }

    if (infoResult.status === StatusTypes.ERROR) {
      return 'Unable to get remote details';
    }

    return `Type: ${infoResult.data?.type}`;
  };

  const renderSpaceUsed = () => {
    if (sizeResult.status === StatusTypes.LOADING) {
      return <Skeleton />;
    }

    if (sizeResult.status === StatusTypes.ERROR) {
      return 'Unable to get space information';
    }

    const totalSpace = prettyBytes(sizeResult.data?.total || 0);
    const spaceUsed = prettyBytes(sizeResult.data?.used || 0);

    return `${spaceUsed} / ${totalSpace} used`;
  };

  return (
    <Card variant="outlined" {...props}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography variant="h6" component="div" className="remote-card__name">
            {remote}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {renderRemoteInfo()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {renderSpaceUsed()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
