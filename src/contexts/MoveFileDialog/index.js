import { createContext, useRef, useState } from 'react';
import MoveFileDialog from 'components/MoveFileDialog';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

export const MoveFileDialogContext = createContext();

export function MoveFileDialogProvider({ children }) {
  const rCloneClient = useRCloneClient();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState(undefined);

  const awaitingPromiseRef = useRef();

  const handleOk = async (remoteFolderPath) => {
    try {
      const [newRemote, newFolderPath] = remoteFolderPath.split(':');

      const src = {
        remote: fileToMove.remote,
        dirPath: fileToMove.dirPath,
        fileName: fileToMove.name,
      };

      const target = {
        remote: newRemote,
        dirPath: newFolderPath,
        fileName: fileToMove.name,
      };

      if (fileToMove.isDirectory) {
        await rCloneClient.move(src, target, true, false);
      } else {
        await rCloneClient.moveFile(src, target);
      }

      setIsOpen(false);
      setFileToMove(undefined);
      awaitingPromiseRef.current?.resolve();
    } catch (error) {
      awaitingPromiseRef.current?.reject(error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFileToMove(undefined);

    awaitingPromiseRef.current?.reject();
  };

  const moveFile = (file) => {
    setFileToMove(file);
    setIsOpen(true);

    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  return (
    <MoveFileDialogContext.Provider value={{ moveFile }}>
      <MoveFileDialog
        open={isOpen}
        fileName={fileToMove?.name}
        onCancel={handleCancel}
        onOk={handleOk}
      />
      {children}
    </MoveFileDialogContext.Provider>
  );
}
