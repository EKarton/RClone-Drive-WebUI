import RCloneClient from 'services/RCloneClient';
import { JobStatus } from 'utils/constants';
import { ActionTypes } from './constants';

export const createRCloneJobTrackerWorker = (postMessage) => {
  const jobs = new Map();

  setInterval(() => {
    jobs.forEach(async (job) => {
      const { jobId, rCloneInfo } = job;

      try {
        const rCloneClient = new RCloneClient(rCloneInfo);
        const { data } = await rCloneClient.getJobStatus(jobId);

        if (data.finished) {
          postMessage({
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
      } catch (error) {
        postMessage({
          jobId,
          status: JobStatus.ERROR,
          error: error,
        });

        jobs.delete(jobId);
      }
    });
  }, 3000);

  const onMessage = ({ data }) => {
    const { actionType, payload } = data;

    switch (actionType) {
      case ActionTypes.TRACK_NEW_JOB: {
        const { jobId } = payload;
        jobs.set(jobId, payload);
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

  return { onMessage };
};

const worker = createRCloneJobTrackerWorker(global.postMessage.bind(global));
global.onmessage = worker.onMessage;
