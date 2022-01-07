import { createContext, useRef, useState } from 'react';
import RenameFileDialog from 'components/RenameFileDialog';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

export const RenameFileDialogContext = createContext();

export const RenameFileDialogProvider = ({ children }) => {
  const rCloneClient = useRCloneClient();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState({});

  const awaitingPromiseRef = useRef();

  const handleOk = async (newFileName) => {
    const { remote, dirPath, name: oldFileName, isDirectory } = fileToRename;

    const src = { remote, dirPath, fileName: oldFileName };
    const target = { remote, dirPath, fileName: newFileName };

    if (isDirectory) {
      await rCloneClient.move(src, target, true);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    setFileToRename(undefined);
    setIsOpen(false);

    awaitingPromiseRef.current?.resolve();
  };

  const handleCancel = () => {
    setFileToRename(undefined);
    setIsOpen(false);

    awaitingPromiseRef.current?.reject();
  };

  const renameFile = (file) => {
    setFileToRename(file);
    setIsOpen(true);

    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  return (
    <RenameFileDialogContext.Provider value={{ renameFile }}>
      <RenameFileDialog
        open={isOpen}
        fileName={fileToRename?.name}
        onCancel={handleCancel}
        onRename={handleOk}
      />
      {children}
    </RenameFileDialogContext.Provider>
  );
};
