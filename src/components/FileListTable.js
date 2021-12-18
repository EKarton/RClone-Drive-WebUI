import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { ICON_SIZE } from 'utils/constants';
import FileListTableRow from './FileListTableRow';

export default function FileListTable({ files, ...props }) {
  return (
    <Table striped data-testid="fileslisttable">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Date Modified</Table.HeaderCell>
          <Table.HeaderCell>File Size</Table.HeaderCell>
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
