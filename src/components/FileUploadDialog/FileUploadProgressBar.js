import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import useFileUploadCounts from 'contexts/FileUploadCounts/useFileUploadCounts';
import './FileUploadProgressBar.scss';

export default function FileUploadProgressBar() {
  const { counts } = useFileUploadCounts();
  const { numSuccessful, numUploading } = counts;

  const percentage = (numSuccessful / (numUploading + numSuccessful)) * 100;
  const roundedPercentage = Math.round(percentage);

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
          {roundedPercentage} %
        </Typography>
      </Box>
    </Box>
  );
}
