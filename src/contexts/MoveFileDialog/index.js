import { createContext, useRef, useState } from 'react';
import MoveFileDialog from 'components/MoveFileDialog';
import useFileMover from 'hooks/rclone/useFileMover';

export const MoveFileDialogContext = createContext();

export function MoveFileDialogProvider({ children }) {
  const fileMover = useFileMover();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState(undefined);

  const awaitingPromiseRef = useRef();

  const handleOk = async (remoteFolderPath) => {
    try {
      const [newRemote, newFolderPath] = remoteFolderPath.split(':');

      const src = {
        remote: fileToMove.remote,
        dirPath: fileToMove.dirPath,
        name: fileToMove.name,
      };

      const target = {
        remote: newRemote,
        dirPath: newFolderPath,
        name: fileToMove.name,
      };

      if (fileToMove.isDirectory) {
        await fileMover.moveFolder(src, target);
      } else {
        await fileMover.moveFile(src, target);
      }

      setIsOpen(false);
      setFileToMove(undefined);
      awaitingPromiseRef.current?.resolve();
    } catch (error) {
      setIsOpen(false);
      setFileToMove(undefined);
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
