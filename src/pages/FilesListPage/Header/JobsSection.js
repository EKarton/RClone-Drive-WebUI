import { useState } from 'react';
import { useJobQueueInfo } from 'contexts/JobQueue';
import { useJobsListDialog } from 'contexts/JobsListDialog/index';
import JobsButton from './JobsButton';
import JobsListPopover from './JobsListPopover';

export default function JobsSection() {
  const { show } = useJobsListDialog();
  const { jobs, statusCounts } = useJobQueueInfo();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMoreButtonClicked = () => {
    setAnchorEl(null);
    show();
  };

  return (
    <>
      <JobsButton
        statusCounts={statusCounts}
        onClick={handleClick}
        data-testid="job-button"
      />
      <JobsListPopover
        open={anchorEl !== null}
        jobs={jobs}
        anchorEl={anchorEl}
        onClose={handleClose}
        onMoreClicked={handleMoreButtonClicked}
      />
    </>
  );
}
