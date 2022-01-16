import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useJobQueueInfo from 'hooks/jobs/useJobQueueInfo';
import ProgressBar from './ProgressBar';
import Table from './Table';

export default function JobsListDialog({ open, onClose }) {
  const { jobs, statusCounts } = useJobQueueInfo();
  const { numSuccessful, numOngoing } = statusCounts;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" data-testid="jobs-list-dialog">
      <DialogTitle>Jobs List</DialogTitle>
      <DialogContent>
        <ProgressBar numSuccessful={numSuccessful} numOngoing={numOngoing} />
        <Table jobs={jobs} />
      </DialogContent>
    </Dialog>
  );
}
