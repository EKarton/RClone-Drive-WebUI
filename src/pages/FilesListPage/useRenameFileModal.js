import { useState } from 'react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import RenameFileDialog from './RenameFileDialog';

export function useRenameFileModal() {
  const rCloneClient = useRCloneClient();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState({});

  const handleFileModalRename = async (newFileName) => {
    const { remote, path, name: oldFileName } = fileToRename;
    const src = { remote, folderPath: path, fileName: oldFileName };
    const target = { remote, folderPath: path, fileName: newFileName };

    if (fileToRename.isDirectory) {
      await rCloneClient.move(src, target, true);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    setIsOpen(false);
    setFileToRename({});
  };

  const handleFileModalCancelled = () => {
    setIsOpen(false);
  };

  const requestToRenameFile = (file) => {
    setFileToRename(file);
    setIsOpen(true);
  };

  const modal = (
    <RenameFileDialog
      open={isOpen}
      fileName={fileToRename.name}
      onCancel={handleFileModalCancelled}
      onRename={handleFileModalRename}
    />
  );

  return { modal, requestToRenameFile };
}
