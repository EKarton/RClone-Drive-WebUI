import RCloneClient from 'utils/RCloneClient';
import { ActionTypes, JobStatus } from './constants';

const jobs = new Map();

setInterval(() => {
  jobs.forEach(async (job) => {
    const { jobId, rCloneInfo } = job;
    const rCloneClient = new RCloneClient(rCloneInfo);
    const { data } = await rCloneClient.getJobStatus(jobId);

    if (data.finished) {
      // eslint-disable-next-line no-restricted-globals
      self.postMessage({
        jobId,
        status: data.success ? JobStatus.SUCCESS : JobStatus.ERROR,
        error: data.error,
        startTime: data.startTime,
        duration: data.duration,
        progress: data.progress,
        output: data.output,
      });

      jobs.delete(jobId);
    }
  });
}, 3000);

// eslint-disable-next-line no-restricted-globals
self.onmessage = ({ data }) => {
  const { actionType, payload } = data;

  switch (actionType) {
    case ActionTypes.TRACK_NEW_JOB: {
      const { jobId, rCloneInfo } = payload;
      jobs.set(jobId, { jobId, rCloneInfo });
      break;
    }
    case ActionTypes.UNTRACK_NEW_JOB: {
      if (jobs.has(payload.jobId)) {
        jobs.delete(payload.jobId);
      }
      break;
    }
    default: {
      throw new Error(`Unknown action type ${actionType}`);
    }
  }
};
