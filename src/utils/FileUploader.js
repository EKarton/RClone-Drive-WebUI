import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { UploadStatusTypes } from './constants';

export default class FileUploader {
  constructor(rCloneClient) {
    this.rCloneClient = rCloneClient;
    this.files = [];
  }

  uploadFile(remote, dirPath, file) {
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
        this.status.next(UploadStatusTypes.CANCELLED);
      },
    };

    const handleUploadSuccess = () => {
      fileObj.status.next(UploadStatusTypes.SUCCESS);
    };

    const handleUploadError = (err) => {
      if (!axios.isCancel(err)) {
        fileObj.status.next(UploadStatusTypes.FAILED);
        fileObj.error = err;
      }
    };

    this.rCloneClient
      .uploadFiles(remote, dirPath, file, { cancelToken: cancelSource.token })
      .then(handleUploadSuccess)
      .catch(handleUploadError);

    this.files.push(fileObj);
    return fileObj;
  }
}
