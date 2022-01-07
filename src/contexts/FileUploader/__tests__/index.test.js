import { renderHook } from '@testing-library/react-hooks';
import { BehaviorSubject } from 'rxjs';
import { useFileUploadCounts } from 'contexts/FileUploadCounts';
import useFileUploaderService from 'hooks/rclone/useFileUploader';
import { UploadStatusTypes } from 'utils/constants';
import { useFileUploader, FileUploaderProvider } from '..';

jest.mock('hooks/rclone/useFileUploader');
jest.mock('contexts/FileUploadCounts');

describe('useFileUploader()', () => {
  const updateUploadStatus = jest.fn();
  const addUploadStatus = jest.fn();
  const uploadFile = jest.fn();

  const filesToUpload = [
    { remote: 'drive', dirPath: 'Pictures', file: {} },
    { remote: 'drive', dirPath: 'Documents', file: {} },
  ];

  beforeEach(() => {
    useFileUploadCounts.mockReturnValue({ updateUploadStatus, addUploadStatus });
    useFileUploaderService.mockReturnValue({ files: [], uploadFile });
  });

  it('should use RCloneClient and update states correctly when called uploadFiles()', () => {
    uploadFile.mockReturnValue({
      remote: 'gdrive',
      dirPath: 'Documents',
      name: 'dog.png',
      size: 100000,
      type: 'application/jpg',
      status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
      cancelUpload: jest.fn(),
    });

    const { result } = renderHook(() => useFileUploader(), {
      wrapper: FileUploaderProvider,
    });

    result.current.uploadFiles(filesToUpload);

    expect(uploadFile).toBeCalledWith('drive', 'Pictures', {});
    expect(uploadFile).toBeCalledWith('drive', 'Documents', {});
    expect(addUploadStatus).toBeCalledWith(UploadStatusTypes.UPLOADING);
  });

  it('should update states correctly when file has been uploaded', () => {
    const fileObj = {
      remote: 'gdrive',
      dirPath: 'Documents',
      name: 'dog.png',
      size: 100000,
      type: 'application/jpg',
      status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
      cancelUpload: jest.fn(),
    };

    uploadFile.mockReturnValue(fileObj);

    const { result } = renderHook(() => useFileUploader(), {
      wrapper: FileUploaderProvider,
    });

    result.current.uploadFiles(filesToUpload);

    fileObj.status.next(UploadStatusTypes.SUCCESS);

    expect(updateUploadStatus).toBeCalledWith(
      UploadStatusTypes.UPLOADING,
      UploadStatusTypes.SUCCESS
    );
  });

  it('should throw an error given hook is not used inside FileUploaderProvider', () => {
    const { result } = renderHook(() => useFileUploader());

    expect(result.error).toBeInstanceOf(Error);
  });
});
