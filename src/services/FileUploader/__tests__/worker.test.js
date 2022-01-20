import axios from 'axios';
import RCloneClient from 'services/RCloneClient';
import { JobStatus } from 'utils/constants';
import { waitFor } from 'test-utils/react';
import { ActionTypes } from '../constants';
import { createFileUploaderWorker } from '../worker';

jest.mock('services/RCloneClient');

describe('createFileUploaderWorker()', () => {
  const createUploadMessage = (jobId) => ({
    data: {
      actionType: ActionTypes.UPLOAD_FILE,
      payload: {
        jobId,
        remote: 'gdrive',
        dirPath: 'Documents',
        file: '1234',
        rCloneInfo: {
          endpoint: 'http://localhost:3000',
          username: 'admin',
          password: '1234',
        },
      },
    },
  });

  const uploadFiles = jest.fn();

  beforeEach(() => {
    RCloneClient.mockImplementation(() => {
      return {
        uploadFiles,
      };
    });
  });

  it('should upload a file given request to upload a file', () => {
    uploadFiles.mockResolvedValue();

    const worker = createFileUploaderWorker(jest.fn());

    worker.onMessage(createUploadMessage(1));

    expect(uploadFiles).toBeCalledWith('gdrive', 'Documents', '1234', {
      cancelToken: expect.any(axios.CancelToken),
    });
  });

  it('should upload multiple files of max. 6 at a time given multiple requests to upload a file', async () => {
    jest.useFakeTimers();
    uploadFiles.mockImplementation(() => {
      return new Promise((resolve, _reject) => {
        setTimeout(resolve, 10000);
      });
    });

    const worker = createFileUploaderWorker(jest.fn());

    for (let i = 1; i < 11; i++) {
      worker.onMessage(createUploadMessage(i));
    }

    jest.advanceTimersByTime(10000);

    expect(uploadFiles).toBeCalledTimes(7);

    jest.advanceTimersByTime(10000);

    await waitFor(() => expect(uploadFiles).toBeCalledTimes(10));
  });

  it('should send a post message given the upload threw an error', async () => {
    const error = new Error('Random error');
    uploadFiles.mockRejectedValue(error);

    const postMessage = jest.fn();
    const worker = createFileUploaderWorker(postMessage);

    worker.onMessage(createUploadMessage('123'));

    await waitFor(() => {
      expect(postMessage).toBeCalledWith({
        jobId: '123',
        status: JobStatus.ERROR,
        error,
      });
    });
  });

  it('should send a post message given the upload was cancelled', async () => {
    const error = new axios.Cancel('API call cancelled');
    uploadFiles.mockRejectedValue(error);

    const postMessage = jest.fn();
    const worker = createFileUploaderWorker(postMessage);

    worker.onMessage(createUploadMessage('1'));

    await waitFor(() => {
      expect(postMessage).toBeCalledWith({
        jobId: '1',
        status: JobStatus.ERROR,
        isCancelled: true,
      });
    });
  });

  it('should call cancel() on the token when an uploaded file is cancelled', () => {
    jest.useFakeTimers();
    uploadFiles.mockImplementation(() => {
      return new Promise((resolve, _reject) => {
        setTimeout(resolve, 10000);
      });
    });

    const token = { cancel: jest.fn() };
    jest.spyOn(axios.CancelToken, 'source').mockReturnValue(token);

    const worker = createFileUploaderWorker(jest.fn());
    worker.onMessage(createUploadMessage('123'));
    worker.onMessage({ data: { actionType: ActionTypes.CANCEL_UPLOAD, payload: '123' } });

    expect(token.cancel).toBeCalled();
  });

  it('should throw an error given an unknown action type', () => {
    const worker = createFileUploaderWorker(jest.fn());
    const fn = () => worker.onMessage({ data: { actionType: 'Random action' } });

    expect(fn).toThrowError();
  });
});
