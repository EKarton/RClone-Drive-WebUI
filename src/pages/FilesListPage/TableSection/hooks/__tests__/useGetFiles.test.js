import { renderHook, act } from '@testing-library/react-hooks';
import { BehaviorSubject } from 'rxjs';
import { useFileUploader } from 'contexts/FileUploader';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import { StatusTypes, UploadStatusTypes } from 'utils/constants';
import { mockFiles } from 'test-utils/mock-responses';
import { waitFor } from 'test-utils/react';
import useGetFiles from '../useGetFiles';

jest.mock('contexts/FileUploader');
jest.mock('hooks/fetch-data/useFetchFiles');

describe('useGetFiles()', () => {
  it.each([StatusTypes.LOADING, StatusTypes.ERROR])(
    'should return correct object given data fetching status is %s',
    (status) => {
      useFileUploader.mockReturnValue({ files: [] });
      useFetchFiles.mockReturnValue({ status });

      const { result } = renderHook(() => useGetFiles('gdrive', ''));

      expect(result.current).toEqual({ status });
    }
  );

  it('should return correct object given data fetching is successful and there are no uploading files', () => {
    useFileUploader.mockReturnValue({ files: [] });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData: jest.fn(),
    });

    const { result } = renderHook(() => useGetFiles('gdrive', ''));

    expect(result.current).toMatchSnapshot();
  });

  it('should return correct object given data fetching is successful and there are new files uploading under the same dir path', () => {
    useFileUploader.mockReturnValue({
      files: [
        {
          remote: 'gdrive',
          dirPath: '',
          name: 'backup-locally.sh',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
      ],
    });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData: jest.fn(),
    });

    const { result } = renderHook(() => useGetFiles('gdrive', ''));

    expect(result.current.data.uploadingFiles.length).toEqual(1);
    expect(result.current).toMatchSnapshot();
  });

  it('should return correct object given data fetching is successful and there are new files uploading under an existing folder', () => {
    useFileUploader.mockReturnValue({
      files: [
        {
          remote: 'gdrive',
          dirPath: 'Pictures',
          name: 'dog.png',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
        {
          remote: 'gdrive',
          dirPath: 'Pictures',
          name: 'cat.png',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
      ],
    });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData: jest.fn(),
    });

    const { result } = renderHook(() => useGetFiles('gdrive', ''));

    expect(result.current.data.uploadingFiles.length).toEqual(0);
  });

  it('should return correct object given data fetching is successful and an existing file is being overwritten', () => {
    useFileUploader.mockReturnValue({
      files: [
        {
          remote: 'gdrive',
          dirPath: '',
          name: 'backup.sh',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
      ],
    });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData: jest.fn(),
    });

    const { result } = renderHook(() => useGetFiles('gdrive', ''));

    expect(result.current.data.uploadingFiles.length).toEqual(0);
  });

  it('should return correct object given data fetching is successful and there are is a new folder being uploaded in the same dir path', () => {
    useFileUploader.mockReturnValue({
      files: [
        {
          remote: 'gdrive',
          dirPath: 'Apps',
          name: 'Messenger.apk',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
        {
          remote: 'gdrive',
          dirPath: 'Apps',
          name: 'YouTube.apk',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
      ],
    });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData: jest.fn(),
    });

    const { result } = renderHook(() => useGetFiles('gdrive', ''));

    expect(result.current.data.uploadingFiles.length).toEqual(1);
    expect(result.current).toMatchSnapshot();
  });

  it('should not return uploading files whose uploading file statuses are not uploading and are not in the current dir path / remote', () => {
    useFileUploader.mockReturnValue({
      files: [
        {
          remote: 'onedrive',
          dirPath: '',
          name: 'document.txt',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
        {
          remote: 'gdrive',
          dirPath: 'Documents/Apps',
          name: 'YouTube.apk',
          status: new BehaviorSubject(UploadStatusTypes.SUCCESS),
        },
        {
          remote: 'gdrive',
          dirPath: 'Pictures',
          name: 'dog.png',
          status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
        },
      ],
    });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: [],
      refetchData: jest.fn(),
    });

    const { result } = renderHook(() => useGetFiles('gdrive', 'Documents'));

    expect(result.current.data.uploadingFiles.length).toEqual(0);
  });

  it('should call refreshData() when new files and folders has successfully been uploaded', async () => {
    const refetchData = jest.fn();
    const uploadingFiles = [
      {
        remote: 'gdrive',
        dirPath: '',
        name: 'backup-locally.sh',
        status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
      },
      {
        remote: 'gdrive',
        dirPath: 'Apps',
        name: 'Messenger.apk',
        status: new BehaviorSubject(UploadStatusTypes.UPLOADING),
      },
    ];

    useFileUploader.mockReturnValue({ files: uploadingFiles });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData,
    });

    renderHook(() => useGetFiles('gdrive', ''));

    act(() => uploadingFiles[0].status.next(UploadStatusTypes.SUCCESS));
    act(() => uploadingFiles[1].status.next(UploadStatusTypes.SUCCESS));

    await waitFor(() => expect(refetchData).toBeCalledTimes(2));
  });
});
