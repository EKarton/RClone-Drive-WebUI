import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import MuiTableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { JobStatus } from 'utils/constants';
import './TableRow.scss';
import TableRowIcon from './TableRowIcon';
import TableRowDescription from './TableRowJobDescription';

export default function TableRow({ job, ...props }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const subscriber = job.status.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [job]);

  const handleCancelButtonClick = () => {
    job.cancelJob();
  };

  return (
    <MuiTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} {...props}>
      <TableCell className="table-row__file-type-cell">
        <TableRowIcon jobType={job.jobType} />
      </TableCell>
      <TableCell classes={{ root: 'table-row__file-name-cell' }}>
        <TableRowDescription status={status} job={job} />
      </TableCell>
      <TableCell align="right" className="table-row__status-cell">
        {status}
      </TableCell>
      <TableCell align="right" className="table-row__cancel-button-cell">
        <IconButton
          aria-label="cancel job"
          onClick={handleCancelButtonClick}
          disabled={status !== JobStatus.ONGOING}
          data-testid="cancel-job-button"
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </MuiTableRow>
  );
}

TableRow.propTypes = {
  file: PropTypes.shape({
    remote: PropTypes.string,
    dirPath: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.instanceOf(BehaviorSubject),
  }),
};
