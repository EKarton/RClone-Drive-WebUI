import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import useFileUploadCounts from 'contexts/FileUploadCounts/useFileUploadCounts';

export default function FileUploadProgressBar() {
  const { counts } = useFileUploadCounts();
  const { numSuccessful, numUploading } = counts;

  const percentage = (numSuccessful / (numUploading + numSuccessful)) * 100;
  const text = `${Math.round(percentage)}%`;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={percentage} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
