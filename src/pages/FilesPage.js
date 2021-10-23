import Toolbar from "@mui/material/Toolbar";
import "./FilesPage.scss";
import GlobalAppBar from "components/GlobalAppBar";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import { Table } from "semantic-ui-react";

const FilesPage = () => {
  const rows = [
    { id: 1, col1: "Hello", col2: "World", col3: "123", col4: "Folder" },
    {
      id: 2,
      col1: "DataGridPro",
      col2: "is Awesome",
      col3: "343",
      col4: "File",
    },
    { id: 3, col1: "MUI", col2: "is Amazing", col3: "123", col4: "File" },
  ];

  const columns = [
    { field: "col1", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "col2", headerName: "Last Updated", width: 200 },
    { field: "col3", headerName: "File Size", flex: 0.3, minWidth: 50 },
    { field: "col4", headerName: "Kind", flex: 0.3, minWidth: 50 },
  ];

  return (
    <>
      <GlobalAppBar />
      <Toolbar />
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Git Repository</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>
              <FolderIcon /> node_modules
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell collapsing textAlign="right">
              10 hours ago
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <FolderIcon /> test
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <FolderIcon /> build
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <DescriptionIcon /> package.json
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <DescriptionIcon /> Gruntfile.js
            </Table.Cell>
            <Table.Cell>Initial commit</Table.Cell>
            <Table.Cell textAlign="right">10 hours ago</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default FilesPage;
