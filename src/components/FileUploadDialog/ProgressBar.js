import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import './ProgressBar.scss';

export default function ProgressBar({ numSuccessful, numUploading }) {
  const percentage = (numSuccessful / (numUploading + numSuccessful)) * 100;

  return (
    <Box className="progress-bar">
      <Box className="progress-bar__bar-wrapper">
        <LinearProgress variant="determinate" value={percentage} />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" className="progress-bar__text">
          {Math.round(percentage)} %
        </Typography>
      </Box>
    </Box>
  );
}
