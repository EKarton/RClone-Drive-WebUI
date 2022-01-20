import { renderHook, act } from '@testing-library/react-hooks';
import { BehaviorSubject } from 'rxjs';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import useJobQueueInfo from 'hooks/jobs/useJobQueueInfo';
import { StatusTypes, JobStatus, JobTypes } from 'utils/constants';
import { mockFiles } from 'test-utils/mock-responses';
import { waitFor } from 'test-utils/react';
import useGetFiles from '../useGetFiles';

jest.mock('hooks/jobs/useJobQueueInfo');
jest.mock('hooks/fetch-data/useFetchFiles');

describe('useGetFiles()', () => {
  it.each([StatusTypes.LOADING, StatusTypes.ERROR])(
    'should return correct object given data fetching status is %s',
    (status) => {
      useJobQueueInfo.mockReturnValue({ jobs: [] });
      useFetchFiles.mockReturnValue({ status });

      const { result } = renderHook(() => useGetFiles('gdrive', ''));

      expect(result.current).toEqual({ status });
    }
  );

  it('should return correct object given data fetching is successful and there are no uploading files', () => {
    useJobQueueInfo.mockReturnValue({ jobs: [] });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData: jest.fn(),
    });

    const { result } = renderHook(() => useGetFiles('gdrive', ''));

    expect(result.current).toMatchSnapshot();
  });

  it('should return correct object given data fetching is successful and there are new files uploading under the same dir path', () => {
    useJobQueueInfo.mockReturnValue({
      jobs: [
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'gdrive',
          dirPath: '',
          name: 'backup-locally.sh',
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
    useJobQueueInfo.mockReturnValue({
      jobs: [
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'gdrive',
          dirPath: 'Pictures',
          name: 'dog.png',
        },
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'gdrive',
          dirPath: 'Pictures',
          name: 'cat.png',
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
    useJobQueueInfo.mockReturnValue({
      jobs: [
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'gdrive',
          dirPath: '',
          name: 'backup.sh',
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
    useJobQueueInfo.mockReturnValue({
      jobs: [
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'gdrive',
          dirPath: 'Apps',
          name: 'Messenger.apk',
        },
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'gdrive',
          dirPath: 'Apps',
          name: 'YouTube.apk',
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
    useJobQueueInfo.mockReturnValue({
      jobs: [
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'onedrive',
          dirPath: '',
          name: 'document.txt',
        },
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.SUCCESS),
          remote: 'gdrive',
          dirPath: 'Documents/Apps',
          name: 'YouTube.apk',
        },
        {
          jobType: JobTypes.UPLOAD_FILE,
          status: new BehaviorSubject(JobStatus.ONGOING),
          remote: 'gdrive',
          dirPath: 'Pictures',
          name: 'dog.png',
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
    const jobs = [
      {
        jobType: JobTypes.UPLOAD_FILE,
        status: new BehaviorSubject(JobStatus.ONGOING),
        remote: 'gdrive',
        dirPath: '',
        name: 'backup-locally.sh',
      },
      {
        jobType: JobTypes.UPLOAD_FILE,
        status: new BehaviorSubject(JobStatus.ONGOING),
        remote: 'gdrive',
        dirPath: 'Apps',
        name: 'Messenger.apk',
      },
    ];

    useJobQueueInfo.mockReturnValue({ jobs });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData,
    });

    renderHook(() => useGetFiles('gdrive', ''));

    act(() => jobs[0].status.next(JobStatus.SUCCESS));
    act(() => jobs[1].status.next(JobStatus.SUCCESS));

    await waitFor(() => expect(refetchData).toBeCalledTimes(2));
  });

  it('should call refreshData() when new moving files in the remote and path are complete', async () => {
    const refetchData = jest.fn();
    const jobs = [
      {
        jobType: JobTypes.MOVE_FILE,
        status: new BehaviorSubject(JobStatus.ONGOING),
        src: {
          remote: 'gdrive',
          dirPath: '',
          name: 'backup-locally.sh',
        },
        target: {
          remote: 'gdrive',
          dirPath: 'Documents',
          name: 'backup-locally.sh',
        },
      },
    ];

    useJobQueueInfo.mockReturnValue({ jobs });
    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData,
    });

    renderHook(() => useGetFiles('gdrive', 'Documents'));

    act(() => jobs[0].status.next(JobStatus.SUCCESS));

    await waitFor(() => expect(refetchData).toBeCalledTimes(1));
  });
});
