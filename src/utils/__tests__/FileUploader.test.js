import axios from 'axios';
import FileUploader from 'utils/FileUploader';
import { UploadStatusTypes } from 'utils/constants';
import { waitFor } from 'test-utils/react';

describe('FileUploader', () => {
  const remote = 'gdrive';
  const dirPath = 'Pictures';
  const mockFile = {
    name: 'dog.png',
    size: 10000,
    type: 'application/jpg',
  };

  it('should call RCloneClient and return a correct file object when called uploadFile()', () => {
    const rCloneClient = {
      uploadFiles: jest.fn().mockImplementation(() => {
        return new Promise((_resolve, _reject) => {});
      }),
    };
    const fileUploader = new FileUploader(rCloneClient);

    const fileObj = fileUploader.uploadFile(remote, dirPath, mockFile);

    expect(rCloneClient.uploadFiles).toBeCalledWith(remote, dirPath, mockFile, {
      cancelToken: expect.anything(),
    });
    expect(fileObj).toMatchInlineSnapshot(`
      Object {
        "cancelUpload": [Function],
        "dirPath": "Pictures",
        "error": undefined,
        "name": "dog.png",
        "remote": "gdrive",
        "size": 10000,
        "status": BehaviorSubject {
          "_value": "Uploading",
          "closed": false,
          "hasError": false,
          "isStopped": false,
          "observers": Array [],
          "thrownError": null,
        },
        "type": "application/jpg",
      }
    `);
  });

  it("should update the file object's upload status when upload has succeeded", async () => {
    const rCloneClient = { uploadFiles: jest.fn().mockResolvedValue() };
    const fileUploader = new FileUploader(rCloneClient);

    const fileObj = fileUploader.uploadFile(remote, dirPath, mockFile);

    await waitFor(() => expect(fileObj.status.value).toEqual(UploadStatusTypes.SUCCESS));
  });

  it("should update the file object's upload status when upload has failed", async () => {
    const error = new Error('Random error');
    const rCloneClient = { uploadFiles: jest.fn().mockRejectedValue(error) };
    const fileUploader = new FileUploader(rCloneClient);

    const fileObj = fileUploader.uploadFile(remote, dirPath, mockFile);

    await waitFor(() => expect(fileObj.status.value).toEqual(UploadStatusTypes.FAILED));
    await waitFor(() => expect(fileObj.error).toEqual(error));
  });

  it("should update the file object's upload status when user calls cancelUpload()", async () => {
    const rCloneClient = {
      uploadFiles: jest.fn().mockRejectedValue(new axios.Cancel('API call cancelled')),
    };
    const fileUploader = new FileUploader(rCloneClient);

    const fileObj = fileUploader.uploadFile(remote, dirPath, mockFile);
    fileObj.cancelUpload();

    await waitFor(() =>
      expect(fileObj.status.value).toEqual(UploadStatusTypes.CANCELLED)
    );
  });
});
