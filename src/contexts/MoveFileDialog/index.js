import useRCloneClient from 'hooks/rclone/useRCloneClient';
import MoveFileDialog from 'pages/FilesListPage/MoveFileDialog';
import { createContext, useRef, useState } from 'react';

export const MoveFileDialogContext = createContext({ moveFile: Promise.reject });

export function FileMoverProvider({ children }) {
  const rCloneClient = useRCloneClient();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState(undefined);

  const awaitingPromiseRef = useRef({
    resolve: () => {},
    reject: () => {},
  });

  const handleOk = async (remoteFolderPath) => {
    const [newRemote, newFolderPath] = remoteFolderPath.split(':');

    const src = {
      remote: fileToMove.remote,
      folderPath: fileToMove.folderPath,
      fileName: fileToMove.name,
    };

    const target = {
      remote: newRemote,
      folderPath: newFolderPath,
      fileName: fileToMove.name,
    };

    if (fileToMove.isDirectory) {
      await rCloneClient.move(src, target, true, false);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    setIsOpen(false);
    setFileToMove(undefined);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFileToMove(undefined);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
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
      <MoveFileDialog open={isOpen} onCancel={handleCancel} onOk={handleOk} />
      {children}
    </MoveFileDialogContext.Provider>
  );
}
