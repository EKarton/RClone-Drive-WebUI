import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import './FileUploadProgressBar.scss';

export default function FileUploadProgressBar({ numSuccessful, numUploading }) {
  const percentage = (numSuccessful / (numUploading + numSuccessful)) * 100;

  return (
    <Box className="file-upload-progress-bar">
      <Box className="file-upload-progress-bar__bar-wrapper">
        <LinearProgress variant="determinate" value={percentage} />
      </Box>
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          className="file-upload-progress-bar__text"
        >
          {Math.round(percentage)} %
        </Typography>
      </Box>
    </Box>
  );
}
