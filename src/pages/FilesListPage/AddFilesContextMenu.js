import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import './AddFilesContextMenu.scss';

export default function AddContentContextMenu({
  open,
  onClose,
  menuPosition,
  onNewFolder,
  onUploadFile,
}) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={menuPosition}
    >
      <MenuItem onClick={onNewFolder}>
        <ListItemIcon>
          <CreateNewFolderIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>New Folder</ListItemText>
      </MenuItem>
      <MenuItem onClick={onUploadFile}>
        <ListItemIcon>
          <UploadFileIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Upload File</ListItemText>
      </MenuItem>
    </Menu>
  );
}
