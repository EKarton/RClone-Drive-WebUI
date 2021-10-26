import PropTypes from "prop-types";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import Icon from "@mui/material/Icon";
import { Table } from "semantic-ui-react";
import "./FileListTable.scss";
import { ICON_SIZE } from "utils/constants";

const FileListTable = ({ files, iconSize, onFileClicked }) => {
  const renderTableRow = (file) => {
    const handleFileClicked = () => {
      onFileClicked(file);
    };

    return (
      <Table.Row>
        <Table.Cell>
          <div
            className="filelist-table__file-cell"
            onClick={handleFileClicked}
          >
            {renderFileIcon(file)}
            <div>{file.name}</div>
          </div>
        </Table.Cell>
        <Table.Cell>{file.lastUpdatedTime}</Table.Cell>
        <Table.Cell>{file.isDirectory ? "-" : file.size}</Table.Cell>
      </Table.Row>
    );
  };

  const renderFileIcon = (file) => {
    if (file.isDirectory) {
      return <FolderIcon fontSize={iconSize} />;
    }

    if (file.isImage && file.fileUrl) {
      return (
        <Icon fontSize={iconSize}>
          <img
            src={file.fileUrl}
            className="filelist-table__image-icon"
            alt={file.name}
          />
        </Icon>
      );
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
};

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
    })
  ),
  iconSize: PropTypes.oneOf(Object.values(ICON_SIZE)),
};

export default FileListTable;
