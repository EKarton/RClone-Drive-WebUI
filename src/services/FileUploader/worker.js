import axios from 'axios';
import { JobStatus } from 'services/RCloneJobTracker/constants';
import RCloneClient from 'utils/RCloneClient';

const cancelTokens = new Map();
const uploadFileQueue = [];
const maxConcurrentRequests = 6;
let numConcurrentRequests = 0;

function tryUpload() {
  if (uploadFileQueue.length === 0) {
    return;
  }

  if (numConcurrentRequests > maxConcurrentRequests) {
    return;
  }

  numConcurrentRequests++;
  const data = uploadFileQueue.shift();
  uploadFile(data);
}

async function uploadFile({ jobId, remote, dirPath, file, rCloneInfo }) {
  try {
    const rCloneClient = new RCloneClient(rCloneInfo);
    const cancelSource = axios.CancelToken.source();
    const axiosOptions = { cancelToken: cancelSource.token };

    cancelTokens.set(jobId, cancelSource);
    await rCloneClient.uploadFiles(remote, dirPath, file, axiosOptions);

    global.postMessage({ jobId, status: JobStatus.SUCCESS });
  } catch (error) {
    if (!axios.isCancel(error)) {
      global.postMessage({ jobId, status: JobStatus.ERROR, error });
    } else {
      global.postMessage({ jobId, status: JobStatus.ERROR, isCancelled: true });
    }
  } finally {
    cancelTokens.delete(jobId);
    numConcurrentRequests -= 1;
    tryUpload();
  }
}

global.onmessage = ({ data }) => {
  const { actionType, payload } = data;

  switch (actionType) {
    case 'UPLOAD_FILE': {
      uploadFileQueue.push(payload);
      tryUpload();
      break;
    }
    case 'CANCEL_UPLOAD': {
      cancelTokens.get(payload).cancel();
      break;
    }
    default: {
      throw new Error(`Unknown action type ${actionType}`);
    }
  }
};
