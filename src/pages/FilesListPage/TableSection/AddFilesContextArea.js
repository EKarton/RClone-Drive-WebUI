import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { getFullPath, getNewFolderName } from 'utils/filename-utils';
import './AddFilesContextArea.scss';

export default function AddFilesContextArea({
  remote,
  path,
  children,
  illustration,
  onNewFolderCreated,
  onUploadedFile,
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
    const newPath = getFullPath(path, newFolderName);

    await rCloneClient.mkdir(remote, newPath);

    onNewFolderCreated();
  };

  const handleUploadFile = () => {
    onUploadedFile();
  };

  return (
    <div className="add-files-context-area">
      {children}
      <div
        className="add-files-context-area__region"
        onContextMenu={handleContextMenuOpened}
        data-testid="add-files-context-area__region"
      >
        {illustration}
      </div>
      <Menu
        open={isMenuOpen}
        onClose={handleContextMenuClosed}
        anchorReference="anchorPosition"
        anchorPosition={menuPos}
      >
        <MenuItem
          onClick={handleContextMenuClicked(handleCreateNewFolder)}
          data-testid="new-folder"
        >
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New Folder</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleContextMenuClicked(handleUploadFile)}
          data-testid="upload-file"
        >
          <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload File</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
