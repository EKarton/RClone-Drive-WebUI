import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { ICON_SIZE } from 'utils/constants';
import Row from './Row';
import './index.scss';

export default function FileListTable({
  files,
  onFileClicked,
  onFileRename,
  onFileCopy,
  onFileDelete,
  onFileDownload,
  onFileMove,
}) {
  const renderRow = (file) => {
    const handleFileClicked = () => onFileClicked(file);
    const handleFileRename = () => onFileRename(file);
    const handleFileCopy = () => onFileCopy(file);
    const handleFileDelete = () => onFileDelete(file);
    const handleFileDownload = () => onFileDownload(file);
    const handleFileMove = () => onFileMove(file);

    return (
      <Row
        key={file.name}
        file={file}
        onFileClicked={handleFileClicked}
        onFileRename={handleFileRename}
        onFileCopy={handleFileCopy}
        onFileDelete={handleFileDelete}
        onFileDownload={handleFileDownload}
        onFileMove={handleFileMove}
      />
    );
  };

  return (
    <Table striped data-testid="file-list-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className="file-list-table__header-cell">
            Name
          </Table.HeaderCell>
          <Table.HeaderCell className="file-list-table__header-cell">
            Date Modified
          </Table.HeaderCell>
          <Table.HeaderCell className="file-list-table__header-cell">
            File Size
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{files.map((file) => renderRow(file))}</Table.Body>
    </Table>
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
