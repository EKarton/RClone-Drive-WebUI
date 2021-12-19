import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { ICON_SIZE } from 'utils/constants';
import FileListTableRow from './FileListTableRow';
import './FileListTable.scss';

export default function FileListTable({ files, ...props }) {
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
      <Table.Body>
        {files.map((file) => (
          <FileListTableRow file={file} {...props} />
        ))}
      </Table.Body>
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
