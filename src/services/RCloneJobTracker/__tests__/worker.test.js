import RCloneClient from 'services/RCloneClient';
import { JobStatus } from 'utils/constants';
import { waitFor } from 'test-utils/react';
import { ActionTypes } from '../constants';
import { createRCloneJobTrackerWorker } from '../worker';

jest.mock('services/RCloneClient');

describe('createRCloneJobTrackerWorker()', () => {
  const getJobStatus = jest.fn();
  const successfulResponse = {
    data: {
      finished: true,
      success: true,
      startTime: 123,
      duration: 123,
      progress: 100,
      output: 'sample output',
      error: undefined,
    },
  };

  const failedResponse = {
    data: {
      finished: true,
      success: false,
      startTime: 123,
      duration: 123,
      progress: 100,
      output: 'sample output',
      error: 'time out',
    },
  };

  beforeEach(() => {
    jest.useFakeTimers();

    RCloneClient.mockImplementation(() => {
      return {
        getJobStatus,
      };
    });
  });

  it('should check the status and post a message when job completes given it is tracking a job ID', async () => {
    getJobStatus.mockResolvedValue(successfulResponse);

    const postMessage = jest.fn();
    const worker = createRCloneJobTrackerWorker(postMessage);
    worker.onMessage(createTrackJobMessage('123'));

    jest.advanceTimersByTime(3000);

    expect(getJobStatus).toBeCalledWith('123');
    await waitFor(() => {
      expect(postMessage).toBeCalledWith({
        jobId: '123',
        status: JobStatus.SUCCESS,
        startTime: 123,
        duration: 123,
        progress: 100,
        output: 'sample output',
      });
    });
  });

  it('should post a message when the job returns an error', async () => {
    getJobStatus.mockResolvedValue(failedResponse);

    const postMessage = jest.fn();
    const worker = createRCloneJobTrackerWorker(postMessage);
    worker.onMessage(createTrackJobMessage('123'));

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(postMessage).toBeCalledWith({
        jobId: '123',
        status: JobStatus.ERROR,
        startTime: 123,
        duration: 123,
        progress: 100,
        output: 'sample output',
        error: 'time out',
      });
    });
  });

  it('should not post a message when the job is not done yet', () => {
    getJobStatus.mockResolvedValue({ data: { finished: false } });

    const postMessage = jest.fn();
    const worker = createRCloneJobTrackerWorker(postMessage);
    worker.onMessage(createTrackJobMessage('123'));

    jest.advanceTimersByTime(3000);

    expect(postMessage).not.toBeCalled();
  });

  it('should post a message when making api call fails', async () => {
    const error = new Error('Random error');
    getJobStatus.mockRejectedValue(error);

    const postMessage = jest.fn();
    const worker = createRCloneJobTrackerWorker(postMessage);
    worker.onMessage(createTrackJobMessage('123'));

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(postMessage).toBeCalledWith({
        jobId: '123',
        status: JobStatus.ERROR,
        error,
      });
    });
  });

  it('should not check the job status when the job ID is no longer being tracked anymore', () => {
    getJobStatus.mockResolvedValue(successfulResponse);

    const worker = createRCloneJobTrackerWorker(jest.fn());
    worker.onMessage(createTrackJobMessage('123'));
    worker.onMessage(createUntrackJobMessage('123'));

    jest.advanceTimersByTime(3000);

    expect(getJobStatus).not.toBeCalled();
  });

  it('should not do anything when untracking non-existing job ID', () => {
    getJobStatus.mockResolvedValue(successfulResponse);

    const worker = createRCloneJobTrackerWorker(jest.fn());
    worker.onMessage(createUntrackJobMessage('123'));
  });

  it('should throw an error when the action type is not correct', () => {
    const worker = createRCloneJobTrackerWorker(jest.fn());
    const fn = () => worker.onMessage({ data: { actionType: 'random' } });

    expect(fn).toThrowError();
  });

  const createTrackJobMessage = (jobId) => ({
    data: {
      actionType: ActionTypes.TRACK_NEW_JOB,
      payload: {
        jobId,
        rCloneInfo: {
          endpoint: 'http://localhost:3000',
          username: 'admin',
          password: '1234',
        },
      },
    },
  });

  const createUntrackJobMessage = (jobId) => ({
    data: {
      actionType: ActionTypes.UNTRACK_NEW_JOB,
      payload: {
        jobId,
      },
    },
  });
});
