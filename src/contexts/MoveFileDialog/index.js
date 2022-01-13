import { useSnackbar } from 'notistack';
import { createContext, useRef, useState } from 'react';
import MoveFileDialog from 'components/MoveFileDialog';
import { useJobQueue } from 'contexts/JobQueue/index';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

export const MoveFileDialogContext = createContext();

export function MoveFileDialogProvider({ children }) {
  const { addJob } = useJobQueue();
  const rCloneClient = useRCloneClient();
  const { enqueueSnackbar } = useSnackbar();
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
        const opts = {
          createEmptySrcDirs: true,
          deleteEmptySrcDirs: true,
          isAsync: true,
        };

        const { jobId } = await rCloneClient.move(src, target, opts);
        addJob(jobId, 'MOVE_DIRECTORY', { src, target });
        enqueueSnackbar(`Moving directory ${src.name} in the background`);
      } else {
        const { jobId } = await rCloneClient.moveFile(src, target, { isAsync: true });
        addJob(jobId, 'MOVE_FILE', { src, target });
        enqueueSnackbar(`Moving file ${src.name} in the background`);
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
