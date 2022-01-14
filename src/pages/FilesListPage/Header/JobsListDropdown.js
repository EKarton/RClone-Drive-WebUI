import List from '@mui/material/List';
import Popover from '@mui/material/Popover';
import JobListItem from './JobListItem';

export default function JobsListDropdown({ open, jobs, anchorEl, onClose }) {
  const recentJobs = jobs.slice(Math.max(0, jobs.length - 4), jobs.length).reverse();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <List dense>
        {recentJobs.map((job) => (
          <JobListItem job={job} />
        ))}
      </List>
    </Popover>
  );
}
