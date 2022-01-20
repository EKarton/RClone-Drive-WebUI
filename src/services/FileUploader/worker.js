import axios from 'axios';
import RCloneClient from 'services/RCloneClient';
import { JobStatus } from 'utils/constants';
import { ActionTypes } from './constants';

export function createFileUploaderWorker(onPostMessage) {
  const cancelTokens = new Map();
  const uploadFileQueue = [];

  const maxConcurrentRequests = 6;
  let numConcurrentRequests = 0;

  const onMessage = ({ data }) => {
    const { actionType, payload } = data;

    switch (actionType) {
      case ActionTypes.UPLOAD_FILE: {
        uploadFileQueue.push(payload);
        tryUpload();
        break;
      }
      case ActionTypes.CANCEL_UPLOAD: {
        cancelTokens.get(payload).cancel();
        break;
      }
      default: {
        throw new Error(`Unknown action type ${actionType}`);
      }
    }
  };

  const tryUpload = () => {
    if (uploadFileQueue.length === 0) {
      return;
    }

    if (numConcurrentRequests > maxConcurrentRequests) {
      return;
    }

    numConcurrentRequests++;
    const data = uploadFileQueue.shift();
    uploadFile(data);
  };

  const uploadFile = async ({ jobId, remote, dirPath, file, rCloneInfo }) => {
    try {
      const rCloneClient = new RCloneClient(rCloneInfo);
      const cancelSource = axios.CancelToken.source();
      const axiosOptions = { cancelToken: cancelSource.token };

      cancelTokens.set(jobId, cancelSource);
      await rCloneClient.uploadFiles(remote, dirPath, file, axiosOptions);

      onPostMessage({ jobId, status: JobStatus.SUCCESS });
    } catch (error) {
      if (!axios.isCancel(error)) {
        onPostMessage({ jobId, status: JobStatus.ERROR, error });
      } else {
        onPostMessage({ jobId, status: JobStatus.ERROR, isCancelled: true });
      }
    } finally {
      cancelTokens.delete(jobId);
      numConcurrentRequests -= 1;
      tryUpload();
    }
  };

  return { onMessage };
}

const worker = createFileUploaderWorker(global.postMessage.bind(global));
global.onmessage = worker.onMessage;
