import RCloneClient from 'utils/RCloneClient';

jest.mock('utils/RCloneClient');

describe('onmessage()', () => {
  const payload = {
    jobId: '1',
    remote: 'gdrive',
    dirPath: 'Documents',
    file: '1234',
    rCloneInfo: {
      endpoint: 'http://localhost:3000',
      username: 'admin',
      password: '1234',
    },
  };

  it('should upload a file given request to upload a file', () => {
    const uploadFiles = jest.fn().mockResolvedValue();
    RCloneClient.mockImplementation(() => {
      return {
        uploadFiles,
      };
    });

    jest.requireActual('../worker');

    global.postMessage({
      actionType: 'UPLOAD_FILE',
      payload,
    });

    console.error(global.postMessage);
  });

  it('should upload multiple files of max. 6 given multiple requests to upload a file', () => {});

  it('should cancel an upload given request to cancel uploading file', () => {});
});
