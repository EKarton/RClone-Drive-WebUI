import { useState } from 'react';
import { useJobQueueInfo } from 'contexts/JobQueue';
import JobsButton from './JobsButton';
import JobsListDropdown from './JobsListDropdown';

export default function JobsSection() {
  const { jobs, statusCounts } = useJobQueueInfo();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <JobsButton statusCounts={statusCounts} onClick={handleClick} />
      <JobsListDropdown
        open={anchorEl !== null}
        jobs={jobs}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
}
