import { useSnackbar } from 'notistack';
import { createContext, useRef, useState } from 'react';
import RenameFileDialog from 'components/RenameFileDialog';
import { useJobQueue } from 'contexts/JobQueue/index';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

export const RenameFileDialogContext = createContext();

export const RenameFileDialogProvider = ({ children }) => {
  const { addJob } = useJobQueue();
  const { enqueueSnackbar } = useSnackbar();
  const rCloneClient = useRCloneClient();
  const [isOpen, setIsOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState({});

  const awaitingPromiseRef = useRef();

  const handleOk = async (newFileName) => {
    try {
      const { remote, dirPath, name: oldFileName, isDirectory } = fileToRename;

      const src = { remote, dirPath, name: oldFileName };
      const target = { remote, dirPath, name: newFileName };

      if (isDirectory) {
        const { jobId } = await rCloneClient.move(src, target, { isAsync: true });
        addJob(jobId);
        enqueueSnackbar(`Renaming folder ${src.name} to ${target.name}`);
      } else {
        const { jobId } = await rCloneClient.moveFile(src, target, { isAsync: true });
        addJob(jobId);
        enqueueSnackbar(`Renaming file ${src.name} to ${target.name}`);
      }

      setFileToRename(undefined);
      setIsOpen(false);

      awaitingPromiseRef.current?.resolve();
    } catch (error) {
      awaitingPromiseRef.current?.reject(error);
    }
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
