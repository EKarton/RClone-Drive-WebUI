import { renderHook } from '@testing-library/react-hooks';
import { useSnackbar } from 'notistack';
import { BehaviorSubject } from 'rxjs';
import { JobQueueProvider } from 'contexts/JobQueue/index';
import useJobQueueInfo from 'hooks/jobs/useJobQueueInfo';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import fileUploader from 'services/FileUploader/singleton';
import { JobStatus } from 'utils/constants';
import useFileUploader from '../useFileUploader';

jest.mock('services/FileUploader/singleton');
jest.mock('hooks/rclone/useRCloneClient');
jest.mock('hooks/rclone/useRCloneInfo');
jest.mock('notistack');

describe('useFileUploader()', () => {
  const jobId = '1';
  const rCloneInfo = {
    endpoint: 'http://localhost:5572',
    username: 'admin',
    password: '1234',
  };

  const fileEntry = {
    fullPath: 'Personal/Tax Return.pdf',
    name: 'Tax Return.pdf',
    file: (resolve, _reject) => resolve('1234'),
  };

  const enqueueSnackbar = jest.fn();

  beforeEach(() => {
    useRCloneInfo.mockReturnValue({ rCloneInfo });
    useSnackbar.mockReturnValue({ enqueueSnackbar });
  });

  it('should call functions and update context correctly when called uploadFileEntries()', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    fileUploader.uploadFile.mockReturnValue({ jobId, status });

    const { result } = renderCustomHook();
    await result.current.uploadFileEntries('gdrive', 'Documents', [fileEntry]);

    expect(fileUploader.uploadFile).toBeCalledWith(
      'gdrive',
      'Documents/Personal',
      '1234',
      rCloneInfo
    );
    expect(result.current.jobs.length).toEqual(1);
    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 1,
      numSuccessful: 0,
    });
  });

  it('should update context value when job status updates', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    fileUploader.uploadFile.mockReturnValue({ jobId, status });

    const { result } = renderCustomHook();
    await result.current.uploadFileEntries('gdrive', 'Documents', [fileEntry]);
    status.next(JobStatus.SUCCESS);

    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 0,
      numSuccessful: 1,
    });
  });

  const renderCustomHook = () => {
    const useCustomHook = () => {
      return { ...useFileUploader(), ...useJobQueueInfo() };
    };

    return renderHook(() => useCustomHook(), { wrapper: JobQueueProvider });
  };
});
