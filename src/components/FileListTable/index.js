import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import StandardRow from '../FileListTableRows/StandardRow/index';
import UploadingRow from '../FileListTableRows/UploadingRow';
import './index.scss';

export default function FileListTable({ children, ...props }) {
  return (
    <TableContainer
      component={Paper}
      className="file-list-table"
      data-testid="file-list-table"
      {...props}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="file-list-table__header-cell">Name</TableCell>
            <TableCell className="file-list-table__header-cell">Date Modified</TableCell>
            <TableCell className="file-list-table__header-cell">File Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="file-list-table__body">{children}</TableBody>
      </Table>
    </TableContainer>
  );
}

FileListTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.oneOfType([UploadingRow, StandardRow])),
};
