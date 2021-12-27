import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import prettyBytes from 'pretty-bytes';
import useFetchRemoteInfo from 'hooks/fetch-data/useFetchRemoteInfo';
import useFetchRemoteSpaceInfo from 'hooks/fetch-data/useFetchRemoteSpaceInfo';
import { StatusTypes } from 'utils/constants';
import './RemoteCard.scss';

export default function RemoteCard({ remote, onClick, ...props }) {
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
