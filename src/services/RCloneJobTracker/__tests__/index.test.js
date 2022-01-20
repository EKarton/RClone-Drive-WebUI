import { BehaviorSubject } from 'rxjs';
import { JobStatus } from 'utils/constants';
import { waitFor } from 'test-utils/react';
import RCloneJobTracker from '../index';

describe('RCloneJobTracker', () => {
  const rCloneInfo = {
    endpoint: 'http://localhost:5572',
    username: 'admin',
    password: '1234',
  };

  it('should post message and return correct object when called trackNewJob()', () => {
    const postMessage = jest.fn();
    global.Worker = class Worker {
      constructor() {
        this.postMessage = postMessage;
        this.addEventListener = jest.fn();
      }
    };

    const service = new RCloneJobTracker();
    const obj = service.trackNewJob('1234', rCloneInfo);

    expect(postMessage).toBeCalled();
    expect(obj).toEqual({
      status: new BehaviorSubject(JobStatus.ONGOING),
      error: undefined,
      startTime: undefined,
      duration: undefined,
      progress: undefined,
      output: undefined,
    });
  });

  it('should update job status when web worker posts an update on an existing job', async () => {
    jest.useFakeTimers();
    const postMessage = jest.fn();
    global.Worker = class Worker {
      constructor() {
        this.postMessage = postMessage;
        this.addEventListener = (_type, eventHandler) => {
          setTimeout(() => {
            eventHandler({
              data: {
                jobId: '1234',
                status: JobStatus.SUCCESS,
              },
            });
          }, 10000);
        };
      }
    };

    const service = new RCloneJobTracker();
    const obj = service.trackNewJob('1234', rCloneInfo);

    jest.runAllTimers();

    await waitFor(() => expect(obj.status.value).toEqual(JobStatus.SUCCESS));
  });

  it('should not do anything when web worker posts a message with unknown job id', () => {
    jest.useFakeTimers();
    const postMessage = jest.fn();
    global.Worker = class Worker {
      constructor() {
        this.postMessage = postMessage;
        this.addEventListener = (_type, eventHandler) => {
          setTimeout(() => {
            eventHandler({
              data: { jobId: '0000000', status: JobStatus.SUCCESS },
            });
          }, 10000);
        };
      }
    };

    new RCloneJobTracker();
    jest.runAllTimers();
  });

  it('should post message and remove job ID from the list when called removeJob()', () => {
    const postMessage = jest.fn();
    global.Worker = class Worker {
      constructor() {
        this.postMessage = postMessage;
        this.addEventListener = jest.fn();
      }
    };

    const service = new RCloneJobTracker();
    service.trackNewJob('1234', rCloneInfo);
    service.removeJob('1234');

    expect(postMessage).toBeCalledTimes(2);
    expect(service.jobIdToObject.keys.length).toEqual(0);
  });
});
