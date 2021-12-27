import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import './FileListTableSkeleton.scss';

export default function FileListTableSkeleton({ numRows }) {
  return (
    <TableContainer
      component={Paper}
      data-testid="files-list-table-skeleton"
      className="file-list-table-skeleton"
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date Modified</TableCell>
            <TableCell>File Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: numRows }, (_, i) => (
            <TableRow key={i} className="file-list-table-skeleton__row">
              <TableCell colSpan={3}>
                <Skeleton animation="wave" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

FileListTableSkeleton.defaultProps = {
  numRows: 5,
};

FileListTableSkeleton.propType = {
  numRows: PropTypes.number,
};
