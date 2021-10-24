import PropTypes from "prop-types";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import Icon from "@mui/material/Icon";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./FileListTable.scss";

const FileListTable = ({ files }) => {
  const renderTableRow = (file) => {
    return (
      <Table.Row>
        <Table.Cell>
          <Link className="filepage__file-cell" to={file.target}>
            {renderFileIcon(file)}
            <div>{file.name}</div>
          </Link>
        </Table.Cell>
        <Table.Cell>{file.lastUpdatedTime}</Table.Cell>
        <Table.Cell>{file.isDirectory ? "-" : file.size}</Table.Cell>
      </Table.Row>
    );
  };

  const renderFileIcon = (file) => {
    if (file.isDirectory) {
      return <FolderIcon />;
    }

    if (file.isImage && file.fileUrl) {
      return (
        <Icon>
          <img src={file.fileUrl} width="24px" />
        </Icon>
      );
    }

    return <DescriptionIcon />;
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

FileListTable.propType = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      target: PropTypes.string.isRequired,
      name: PropTypes.string,
      lastUpdatedTime: PropTypes.string,
      size: PropTypes.string,
      isDirectory: PropTypes.bool.isRequired,
      isImage: PropTypes.bool.isRequired,
    })
  ),
};

export default FileListTable;
