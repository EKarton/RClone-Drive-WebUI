import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './BaseCard.scss';

export default function BaseCard({ remoteName, remoteType, remoteSpace, ...props }) {
  return (
    <Card variant="outlined" {...props}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h6" component="div" className="remote-base-card__name">
            {remoteName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {remoteType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {remoteSpace}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
