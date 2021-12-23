import { useState } from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import './AddFilesContextArea.scss';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { getNewFolderName } from 'utils/filename-utils';

export default function AddFilesContextArea({
  remote,
  path,
  children,
  onNewFolderCreated,
}) {
  const rCloneClient = useRCloneClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);

  const handleContextMenuOpened = (e) => {
    e.preventDefault();

    setMenuPos({ left: e.clientX - 2, top: e.clientY - 4 });
    setIsMenuOpen(true);
  };

  const handleContextMenuClosed = () => {
    setMenuPos(undefined);
    setIsMenuOpen(false);
  };

  const handleContextMenuClicked = (func) => () => {
    setMenuPos(undefined);
    setIsMenuOpen(false);
    func();
  };

  const handleCreateNewFolder = async () => {
    const files = await rCloneClient.fetchFiles(remote, path);
    const existingFolderNames = files.filter((f) => f.IsDir).map((dir) => dir.Name);

    const newFolderName = getNewFolderName(existingFolderNames);
    const newPath = path ? `${path}/${newFolderName}` : newFolderName;

    await rCloneClient.mkdir(remote, newPath);

    onNewFolderCreated();
  };

  const handleUploadFile = () => {};

  return (
    <div className="add-files-context-area">
      {children}
      <div
        className="add-files-context-area__region"
        onContextMenu={handleContextMenuOpened}
      ></div>
      <Menu
        open={isMenuOpen}
        onClose={handleContextMenuClosed}
        anchorReference="anchorPosition"
        anchorPosition={menuPos}
      >
        <MenuItem onClick={handleContextMenuClicked(handleCreateNewFolder)}>
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New Folder</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleContextMenuClicked(handleUploadFile)}>
          <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload File</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
