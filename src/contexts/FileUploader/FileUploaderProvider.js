import axios from 'axios';
import { useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import useFileUploadCounts from 'contexts/FileUploadCounts/useFileUploadCounts';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { UploadStatusTypes } from 'utils/constants';
import FileUploaderContext from './FileUploaderContext';

export default function FileUploaderProvider({ children }) {
  const { addUploadStatus, updateUploadStatus } = useFileUploadCounts();
  const [files, setFiles] = useState([]);
  const rCloneClient = useRCloneClient();

  const uploadFiles = (files) => {
    const newFileObjs = [];

    for (const fileInfo of files) {
      const { remote, dirPath, file } = fileInfo;
      const cancelSource = axios.CancelToken.source();

      const fileObj = {
        remote,
        dirPath,
        name: file.name,
        size: file.size,
        type: file.type,
        status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        error: undefined,
        cancelUpload: function () {
          cancelSource.cancel();
          updateUploadStatus(this.status.value, UploadStatusTypes.CANCELLED);
          this.status.next(UploadStatusTypes.CANCELLED);
        },
      };

      const updateFileObjStatus = (newStatus) => {
        updateUploadStatus(fileObj.status.value, newStatus);
        fileObj.status.next(newStatus);
      };

      const handleSuccess = () => {
        updateFileObjStatus(UploadStatusTypes.SUCCESS);
      };

      const handleError = (err) => {
        if (!axios.isCancel(err)) {
          updateFileObjStatus(UploadStatusTypes.FAILED);
          fileObj.error = err;
        }
      };

      const opts = { cancelToken: cancelSource.token };

      rCloneClient
        .uploadFiles(remote, dirPath, file, opts)
        .then(handleSuccess)
        .catch(handleError);

      newFileObjs.push(fileObj);
      addUploadStatus(UploadStatusTypes.UPLOADING);
    }

    setFiles((curFiles) => [...newFileObjs, ...curFiles]);
  };

  return (
    <FileUploaderContext.Provider value={{ files, uploadFiles }}>
      {children}
    </FileUploaderContext.Provider>
  );
}
