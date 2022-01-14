import CloudDoneIcon from '@mui/icons-material/CloudDone';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function JobsButton({ statusCounts, ...props }) {
  const { numOngoing, numSuccessful, numFailed } = statusCounts;

  if (numOngoing === 0 && numSuccessful === 0 && numFailed === 0) {
    return null;
  }

  if (numOngoing > 0) {
    return (
      <Button startIcon={<CircularProgress size={20} />} {...props}>
        {numOngoing} Jobs Running
      </Button>
    );
  }

  return (
    <Button startIcon={<CloudDoneIcon />} {...props}>
      {numSuccessful} Jobs Finished
    </Button>
  );
}
