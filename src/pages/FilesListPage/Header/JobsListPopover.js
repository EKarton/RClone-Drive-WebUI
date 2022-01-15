import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import JobListItem from './JobListItem';

export default function JobsListPopover(props) {
  const { open, jobs, anchorEl, onClose, onMoreClicked } = props;
  const recentJobs = jobs.slice(Math.max(0, jobs.length - 4), jobs.length);

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
        <Divider />
        <ListItemButton onClick={onMoreClicked}>
          <ListItemText primary="More details" />
        </ListItemButton>
      </List>
    </Popover>
  );
}
