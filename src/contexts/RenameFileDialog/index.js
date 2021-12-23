import useRCloneClient from 'hooks/rclone/useRCloneClient';
import RenameFileDialog from 'pages/FilesListPage/RenameFileDialog';
import { createContext, useRef, useState } from 'react';

export const RenameFileDialogContext = createContext({ renameFile: Promise.reject });

export const FileRenamerProvider = ({ children }) => {
  const rCloneClient = useRCloneClient();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState({});

  const awaitingPromiseRef = useRef({
    resolve: () => {},
    reject: () => {},
  });

  const handleOk = async (newFileName) => {
    const { remote, folderPath, name: oldFileName, isDirectory } = fileToRename;

    const src = { remote, folderPath, fileName: oldFileName };
    const target = { remote, folderPath, fileName: newFileName };

    if (isDirectory) {
      await rCloneClient.move(src, target, true);
    } else {
      await rCloneClient.moveFile(src, target);
    }

    setFileToRename(undefined);
    setIsOpen(false);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
  };

  const handleCancel = () => {
    setFileToRename(undefined);
    setIsOpen(false);

    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
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
