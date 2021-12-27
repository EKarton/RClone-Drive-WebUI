import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { ICON_SIZE } from 'utils/constants';
import Row from './Row';
import './index.scss';

export default function FileListTable({
  files,
  onFileOpen,
  onFileRename,
  onFileCopy,
  onFileDelete,
  onFileDownload,
  onFileMove,
}) {
  const renderRow = (file) => {
    const handleFileOpen = () => onFileOpen(file);
    const handleFileRename = () => onFileRename(file);
    const handleFileCopy = () => onFileCopy(file);
    const handleFileDelete = () => onFileDelete(file);
    const handleFileDownload = () => onFileDownload(file);
    const handleFileMove = () => onFileMove(file);

    return (
      <Row
        key={file.name}
        file={file}
        onFileOpen={handleFileOpen}
        onFileRename={handleFileRename}
        onFileCopy={handleFileCopy}
        onFileDelete={handleFileDelete}
        onFileDownload={handleFileDownload}
        onFileMove={handleFileMove}
      />
    );
  };

  return (
    <TableContainer
      component={Paper}
      className="file-list-table"
      data-testid="file-list-table"
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="file-list-table__header-cell">Name</TableCell>
            <TableCell className="file-list-table__header-cell">Date Modified</TableCell>
            <TableCell className="file-list-table__header-cell">File Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="file-list-table__body">
          {files.map((file) => renderRow(file))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

FileListTable.defaultProps = {
  iconSize: ICON_SIZE.LARGE,
};

FileListTable.propType = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      lastUpdatedTime: PropTypes.string,
      size: PropTypes.string,
      isDirectory: PropTypes.bool.isRequired,
      isImage: PropTypes.bool.isRequired,
      preview: PropTypes.node,
    })
  ),
  iconSize: PropTypes.oneOf(Object.values(ICON_SIZE)),
};
