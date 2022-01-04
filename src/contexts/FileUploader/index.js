import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import UploadFileManagerDialog from 'components/UploadFileManagerDialog/index';
import useRCloneClient from 'hooks/rclone/useRCloneClient';

export const UploadStatusTypes = Object.freeze({
  NOT_STARTED: 'Not started',
  UPLOADING: 'Uploading',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
});

export const FileUploaderContext = createContext();

export const useFileUploader = () => {
  const context = useContext(FileUploaderContext);

  if (!context) {
    throw new Error('This hook must be used inside FileUploaderContextProvider');
  }

  return context;
};

export const FileUploaderContextProvider = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const rCloneClient = useRCloneClient();

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const cancelUploadFile = (fileId) => {
    const idx = files.findIndex((file) => file.id === fileId);
    if (idx === -1) {
      return;
    }

    const curFile = files[idx];
    curFile.cancelSource.cancel();

    setFiles((curFiles) => {
      const idx = curFiles.findIndex((file) => file.id === fileId);
      if (idx === -1) {
        return;
      }

      const curFile = curFiles[idx];
      curFile.status = UploadStatusTypes.CANCELLED;

      const newFiles = [...curFiles];
      newFiles[idx] = curFile;
      return newFiles;
    });
  };

  const uploadFile = (remote, dirPath, file) => {
    const id = uuidv4();
    const cancelSource = axios.CancelToken.source();

    const onUploadProgress = (progressEvent) => {
      const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setFiles((curFiles) => {
        const idx = curFiles.findIndex((file) => file.id === id);
        if (idx === -1) {
          return;
        }

        const curFile = curFiles[idx];
        curFile.status = UploadStatusTypes.UPLOADING;
        curFile.uploadProgress = percentage;

        const newFiles = [...curFiles];
        newFiles[idx] = curFile;
        return newFiles;
      });
    };

    const handleSuccess = () => {
      setFiles((curFiles) => {
        const idx = curFiles.findIndex((file) => file.id === id);
        if (idx === -1) {
          return;
        }

        const curFile = curFiles[idx];
        curFile.status = UploadStatusTypes.SUCCESS;
        curFile.uploadProgress = 100;

        const newFiles = [...curFiles];
        newFiles[idx] = curFile;
        return newFiles;
      });
    };

    const handleError = (err) => {
      setFiles((curFiles) => {
        const idx = curFiles.findIndex((file) => file.id === id);
        if (idx === -1) {
          return;
        }

        const curFile = curFiles[idx];
        curFile.status = UploadStatusTypes.FAILED;
        curFile.error = err;

        const newFiles = [...curFiles];
        newFiles[idx] = curFile;
        return newFiles;
      });
    };

    const opts = { onUploadProgress, cancelToken: cancelSource.token };

    rCloneClient
      .uploadFiles(remote, dirPath, file, opts)
      .then(handleSuccess)
      .catch(handleError);

    const fileObj = {
      id,
      remote,
      dirPath,
      name: file.name,
      size: file.size,
      type: file.type,
      status: UploadStatusTypes.NOT_STARTED,
      error: undefined,
      cancelSource,
    };

    setFiles((curFiles) => [...curFiles, fileObj]);
  };

  return (
    <FileUploaderContext.Provider
      value={{ files, uploadFile, cancelUploadFile, openDialog }}
    >
      <UploadFileManagerDialog
        open={isDialogOpen}
        files={files}
        onClose={handleCloseDialog}
      />
      {children}
    </FileUploaderContext.Provider>
  );
};
