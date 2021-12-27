import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import './FileListTableSkeleton.scss';

export default function FileListTableSkeleton({ numRows }) {
  return (
    <Table
      striped
      data-testid="files-list-table-skeleton"
      className="file-list-table-skeleton"
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Date Modified</Table.HeaderCell>
          <Table.HeaderCell>File Size</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: numRows }, (_, i) => (
          <Table.Row key={i}>
            <Table.Cell colSpan={3}>
              <Skeleton animation="wave" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

FileListTableSkeleton.defaultProps = {
  numRows: 5,
};

FileListTableSkeleton.propType = {
  numRows: PropTypes.number,
};
