import { BehaviorSubject } from 'rxjs';
import { JobStatus } from 'utils/constants';
import { waitFor } from 'test-utils/react';
import FileUploader from '../index';

jest.mock('uuid', () => ({
  v4: () => '1234',
}));

describe('FileUploader', () => {
  const rCloneInfo = {
    endpoint: 'http://localhost:5572',
    username: 'admin',
    password: '1234',
  };

  it('should post message to web worker and return correct object given call to uploadFile()', () => {
    const postMessage = jest.fn();
    global.Worker = class Worker {
      constructor() {
        this.postMessage = postMessage;
        this.addEventListener = jest.fn();
      }
    };

    const service = new FileUploader();
    const obj = service.uploadFile('gdrive', 'Documents', '1234', rCloneInfo);

    expect(postMessage).toBeCalled();
    expect(obj).toEqual({
      status: new BehaviorSubject(JobStatus.ONGOING),
      error: undefined,
      cancelJob: expect.any(Function),
    });
  });

  it('should update status given worker has posted a message', async () => {
    jest.useFakeTimers();
    const postMessage = jest.fn();
    global.Worker = class Worker {
      constructor() {
        this.postMessage = postMessage;
        this.addEventListener = (_type, eventHandler) => {
          setTimeout(() => {
            eventHandler({
              data: { jobId: '1234', status: JobStatus.SUCCESS },
            });
          }, 10000);
        };
      }
    };

    const service = new FileUploader();
    const obj = service.uploadFile('gdrive', 'Documents', '1234', rCloneInfo);

    jest.runAllTimers();
    await waitFor(() => expect(obj.status.value).toEqual(JobStatus.SUCCESS));
  });

  it('should not do anything when web worker posts a message with unknown job id', async () => {
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

    new FileUploader();
    jest.runAllTimers();
  });

  it('should post a message to the worker when cancelJob is called', () => {
    const postMessage = jest.fn();
    global.Worker = class Worker {
      constructor() {
        this.postMessage = postMessage;
        this.addEventListener = jest.fn();
      }
    };

    const service = new FileUploader();
    const obj = service.uploadFile('gdrive', 'Documents', '1234', rCloneInfo);
    obj.cancelJob();

    expect(postMessage).toBeCalledWith({ actionType: 'CANCEL_UPLOAD', payload: '1234' });
  });
});
