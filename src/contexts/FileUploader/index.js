import { createContext, useContext, useEffect, useState } from 'react';
import { startWith, pairwise } from 'rxjs/operators';
import { useFileUploadCounts } from 'contexts/FileUploadCounts';
import useFileUploaderService from 'hooks/rclone/useFileUploader';

const FileUploaderContext = createContext();

export function FileUploaderProvider({ children }) {
  const { addUploadStatus, updateUploadStatus } = useFileUploadCounts();
  const fileUploader = useFileUploaderService();
  const [files, setFiles] = useState([]);

  const uploadFiles = (files) => {
    const newSubscribers = [];

    for (const fileInfo of files) {
      const { remote, dirPath, file } = fileInfo;
      const fileObj = fileUploader.uploadFile(remote, dirPath, file);

      fileObj.status
        .pipe(startWith(null), pairwise())
        .subscribe(([prevStatus, curStatus]) => {
          if (prevStatus) {
            updateUploadStatus(prevStatus, curStatus);
          } else {
            addUploadStatus(curStatus);
          }
        });
    }

    setFiles([...fileUploader.files]);
  };

  return (
    <FileUploaderContext.Provider value={{ files, uploadFiles }}>
      {children}
    </FileUploaderContext.Provider>
  );
}

export function useFileUploader() {
  const context = useContext(FileUploaderContext);

  if (!context) {
    throw new Error('This hook must be used inside FileUploaderProvider');
  }

  return context;
}
