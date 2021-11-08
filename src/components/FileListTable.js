import PropTypes from 'prop-types';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import Icon from '@mui/material/Icon';
import { Table } from 'semantic-ui-react';
import { ICON_SIZE } from 'utils/constants';
import './FileListTable.scss';

export default function FileListTable({ files, iconSize, onFileClicked }) {
  const renderTableRow = (file) => {
    const handleFileClicked = () => {
      onFileClicked(file);
    };

    return (
      <Table.Row key={file.name}>
        <Table.Cell>
          <div
            className="filelist-table__file-cell"
            onClick={handleFileClicked}
            data-testid={file.name}
          >
            {renderFileIcon(file)}
            <div>{file.name}</div>
          </div>
        </Table.Cell>
        <Table.Cell>{file.lastUpdatedTime}</Table.Cell>
        <Table.Cell>{file.isDirectory ? '-' : file.size}</Table.Cell>
      </Table.Row>
    );
  };

  const renderFileIcon = (file) => {
    if (file.isDirectory) {
      return <FolderIcon fontSize={iconSize} />;
    }

    if (file.isImage) {
      if (file.preview) {
        return (
          <Icon fontSize={iconSize} className="filelist-table__preview-icon">
            {file.preview}
          </Icon>
        );
      }

      return <ImageIcon fontSize={iconSize} />;
    }

    return <DescriptionIcon fontSize={iconSize} />;
  };

  return (
    <Table striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Date Modified</Table.HeaderCell>
          <Table.HeaderCell>File Size</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{files.map((file) => renderTableRow(file))}</Table.Body>
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
