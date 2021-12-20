import { useState } from 'react';
import AddFilesContextMenu from './AddFilesContextMenu';
import './AddFilesContextArea.scss';
import useRCloneClient from 'hooks/useRCloneClient';
import { getNewFolderName } from 'utils/filename-utils';

export default function AddFilesContextArea({
  remote,
  path,
  existingFolderNames,
  children,
  onNewFolderCreated,
}) {
  const rCloneClient = useRCloneClient();

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState(null);

  const handleContextMenuOpened = (e) => {
    e.preventDefault();

    setContextMenuPos({ left: e.clientX - 2, top: e.clientY - 4 });
    setIsContextMenuOpen(true);
  };

  const handleContextMenuClosed = () => {
    setContextMenuPos(undefined);
    setIsContextMenuOpen(false);
  };

  const handleContextMenuClicked = (func) => () => {
    setContextMenuPos(undefined);
    setIsContextMenuOpen(false);
    func();
  };

  const handleCreateNewFolder = async () => {
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
      <AddFilesContextMenu
        open={isContextMenuOpen}
        onClose={handleContextMenuClosed}
        menuPosition={contextMenuPos}
        onNewFolder={handleContextMenuClicked(handleCreateNewFolder)}
        onUploadFile={handleContextMenuClicked(handleUploadFile)}
      />
    </div>
  );
}
