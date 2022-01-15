import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { JobStatus } from 'services/RCloneJobTracker/constants';

export default class FileUploader {
  constructor() {
    this.worker = new Worker(new URL('./webWorker.js', import.meta.url));
    this.jobIdToObject = new Map();

    this.worker.onmessage = ({ data }) => {
      const { jobId, status, error, isCancelled } = data;
      const jobObj = this.jobIdToObject.get(jobId);

      if (!jobObj) {
        return;
      }

      jobObj.status.next(status);
      jobObj.error = error;
      jobObj.isCancelled = isCancelled;
    };
  }

  uploadFile(remote, dirPath, file, rCloneInfo) {
    const jobId = uuidv4();
    const fileObj = {
      status: new BehaviorSubject(JobStatus.ONGOING),
      error: undefined,
      cancelUpload: function () {
        this.worker.postMessage({ actionType: 'CANCEL_UPLOAD', payload: jobId });
      },
    };

    this.jobIdToObject.set(jobId, fileObj);
    this.worker.postMessage({
      actionType: 'UPLOAD_FILE',
      payload: {
        jobId,
        remote,
        dirPath,
        file,
        rCloneInfo,
      },
    });

    return fileObj;
  }
}
