import { createContext, useRef, useState } from 'react';
import RenameFileDialog from 'components/RenameFileDialog';
import useFileRenamer from 'hooks/rclone/useFileRenamer';

export const RenameFileDialogContext = createContext();

export const RenameFileDialogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState({});
  const fileRenamer = useFileRenamer();

  const awaitingPromiseRef = useRef();

  const handleOk = async (newFileName) => {
    try {
      if (fileToRename.isDirectory) {
        await fileRenamer.renameFolder(
          fileToRename.remote,
          fileToRename.dirPath,
          fileToRename.name,
          newFileName
        );
      } else {
        await fileRenamer.renameFile(
          fileToRename.remote,
          fileToRename.dirPath,
          fileToRename.name,
          newFileName
        );
      }

      closeDialog();
      awaitingPromiseRef.current?.resolve();
    } catch (error) {
      closeDialog();
      awaitingPromiseRef.current?.reject(error);
    }
  };

  const handleCancel = () => {
    closeDialog();
    awaitingPromiseRef.current?.reject();
  };

  const closeDialog = () => {
    setFileToRename(undefined);
    setIsOpen(false);
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
