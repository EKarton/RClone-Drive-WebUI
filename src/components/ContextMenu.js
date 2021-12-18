import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';
import './ContextMenu.scss';

export default function ContextMenu(props) {
  const { onOpen, onDownload, onDelete, onMove, onCopy, onRename } = props;
  const { onMenuChanged } = props;
  const { children } = props;

  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenuClicked = (func) => () => {
    setContextMenu(null);
    onMenuChanged({ isOpen: false });
    func();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();

    const menuPosition = { left: e.clientX - 2, top: e.clientY - 4 };
    const newContextMenu = contextMenu === null ? menuPosition : null;
    setContextMenu(newContextMenu);
    onMenuChanged({ isOpen: newContextMenu !== null });
  };

  const handleClose = () => {
    onMenuChanged({ isOpen: false });
    setContextMenu(null);
  };

  return (
    <div onContextMenu={handleContextMenu} className="context-menu">
      {children}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu !== null ? contextMenu : undefined}
      >
        <MenuItem onClick={handleContextMenuClicked(onOpen)}>
          <ListItemIcon>
            <FileOpenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleContextMenuClicked(onDownload)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleContextMenuClicked(onMove)}>
          <ListItemIcon>
            <DriveFileMoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleContextMenuClicked(onCopy)}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleContextMenuClicked(onRename)}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleContextMenuClicked(onDelete)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}

ContextMenu.defaultProps = {
  onOpen: () => {},
  onDownload: () => {},
  onDelete: () => {},
  onMove: () => {},
  onCopy: () => {},
  onRename: () => {},
};
