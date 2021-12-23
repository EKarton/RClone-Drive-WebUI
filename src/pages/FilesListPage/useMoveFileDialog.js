import { useState } from 'react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import MoveFileDialog from './MoveFileDialog';

export function useMoveFileDialog() {
  const rCloneClient = useRCloneClient();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState({});

  const handleMoveFileDialogOk = async (remotePath) => {
    const [newRemote, newPath] = remotePath.split(':');

    const src = {
      remote: fileToMove.remote,
      folderPath: fileToMove.path,
      fileName: fileToMove.name,
    };

    const target = {
      remote: newRemote,
      folderPath: newPath,
      fileName: fileToMove.name,
    };

    if (fileToMove.isDirectory) {
      await rCloneClient.move(src, target, true, false);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    setIsOpen(false);
    setFileToMove({});
  };

  const handleModalCancelled = () => {
    setFileToMove({});
    setIsOpen(false);
  };

  const requestToMoveFile = (file) => {
    setFileToMove(file);
    setIsOpen(true);
  };

  const modal = (
    <MoveFileDialog
      open={isOpen}
      onCancel={handleModalCancelled}
      onOk={handleMoveFileDialogOk}
    />
  );

  return { modal, requestToMoveFile };
}
