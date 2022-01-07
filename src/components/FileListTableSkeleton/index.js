import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import FileListTable from '../FileListTable';
import './index.scss';

export default function FileListTableSkeleton({ numRows }) {
  return (
    <FileListTable data-testid="files-list-table-skeleton">
      {Array.from({ length: numRows }, (_, i) => (
        <TableRow key={i} className="file-list-table-skeleton__row">
          <TableCell colSpan={3}>
            <Skeleton animation="wave" />
          </TableCell>
        </TableRow>
      ))}
    </FileListTable>
  );
}

FileListTableSkeleton.defaultProps = {
  numRows: 5,
};

FileListTableSkeleton.propTypes = {
  numRows: PropTypes.number,
};
