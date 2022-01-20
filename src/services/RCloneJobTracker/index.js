import { BehaviorSubject } from 'rxjs';
import { JobStatus } from 'utils/constants';
import { ActionTypes } from './constants';

export default class RCloneJobTracker {
  constructor() {
    this.worker = new Worker(new URL('./worker.js', import.meta.url));
    this.jobIdToObject = new Map();

    this.worker.addEventListener('message', ({ data }) => {
      const { jobId, status, error, startTime, duration, progress, output } = data;
      const jobObj = this.jobIdToObject.get(jobId);

      if (!jobObj) {
        return;
      }

      jobObj.status.next(status);
      jobObj.error = error;
      jobObj.startTime = startTime;
      jobObj.duration = duration;
      jobObj.progress = progress;
      jobObj.output = output;
    });
  }

  trackNewJob(jobId, rCloneInfo) {
    const jobObj = {
      status: new BehaviorSubject(JobStatus.ONGOING),
      error: undefined,
      startTime: undefined,
      duration: undefined,
      progress: undefined,
      output: undefined,
    };

    this.jobIdToObject.set(jobId, jobObj);
    this.worker.postMessage({
      actionType: ActionTypes.TRACK_NEW_JOB,
      payload: {
        jobId,
        rCloneInfo,
      },
    });

    return jobObj;
  }

  removeJob(jobId) {
    this.worker.postMessage({
      actionType: ActionTypes.UNTRACK_NEW_JOB,
      payload: {
        jobId,
      },
    });

    this.jobIdToObject.delete(jobId);
  }
}
