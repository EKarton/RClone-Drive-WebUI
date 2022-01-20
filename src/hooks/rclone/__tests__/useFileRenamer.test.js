import { renderHook } from '@testing-library/react-hooks';
import { useSnackbar } from 'notistack';
import { BehaviorSubject } from 'rxjs';
import { JobQueueProvider } from 'contexts/JobQueue/index';
import useJobQueueInfo from 'hooks/jobs/useJobQueueInfo';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import rCloneJobTracker from 'services/RCloneJobTracker/singleton';
import { JobStatus } from 'utils/constants';
import useFileRenamer from '../useFileRenamer';

jest.mock('services/RCloneJobTracker/singleton');
jest.mock('hooks/rclone/useRCloneClient');
jest.mock('hooks/rclone/useRCloneInfo');
jest.mock('notistack');

describe('useFileRenamer()', () => {
  const jobId = '1';
  const rCloneInfo = {
    endpoint: 'http://localhost:5572',
    username: 'admin',
    password: '1234',
  };

  const moveFile = jest.fn();
  const move = jest.fn();
  const enqueueSnackbar = jest.fn();

  beforeEach(() => {
    moveFile.mockResolvedValue({ data: { jobid: jobId } });
    move.mockResolvedValue({ data: { jobid: jobId } });

    useRCloneClient.mockReturnValue({ moveFile, move });
    useRCloneInfo.mockReturnValue({ rCloneInfo });
    rCloneJobTracker.trackNewJob.mockReturnValue({});
    useSnackbar.mockReturnValue({ enqueueSnackbar });
  });

  it('should call functions and update context correctly when called renameFile()', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    rCloneJobTracker.trackNewJob.mockReturnValue({ status });

    const { result } = renderCustomHook();
    await result.current.renameFile('gdrive', 'Documents', 'Dog.png', 'Cat.png');

    const expectedSrc = { remote: 'gdrive', dirPath: 'Documents', name: 'Dog.png' };
    const expectedTarget = { remote: 'gdrive', dirPath: 'Documents', name: 'Cat.png' };
    expect(moveFile).toBeCalledWith(expectedSrc, expectedTarget, { isAsync: true });
    expect(rCloneJobTracker.trackNewJob).toBeCalledWith(jobId, rCloneInfo);
    expect(enqueueSnackbar).toBeCalled();
    expect(result.current.jobs.length).toEqual(1);
    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 1,
      numSuccessful: 0,
    });
  });

  it('should call functions and update context correctly when called renameFolder()', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    rCloneJobTracker.trackNewJob.mockReturnValue({ status });

    const { result } = renderCustomHook();
    await result.current.renameFolder('gdrive', 'Documents', 'Personal', 'Work');

    const expectedSrc = { remote: 'gdrive', dirPath: 'Documents', name: 'Personal' };
    const expectedTarget = { remote: 'gdrive', dirPath: 'Documents', name: 'Work' };
    expect(move).toBeCalledWith(expectedSrc, expectedTarget, { isAsync: true });
    expect(rCloneJobTracker.trackNewJob).toBeCalledWith(jobId, rCloneInfo);
    expect(enqueueSnackbar).toBeCalled();
    expect(result.current.jobs.length).toEqual(1);
    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 1,
      numSuccessful: 0,
    });
  });

  it('should update context when job status updates', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    rCloneJobTracker.trackNewJob.mockReturnValue({ status });

    const { result } = renderCustomHook();
    await result.current.renameFile('gdrive', 'Documents', 'Dog.png', 'Cat.png');
    status.next(JobStatus.SUCCESS);

    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 0,
      numSuccessful: 1,
    });
  });

  const renderCustomHook = () => {
    const useCustomHook = () => {
      return { ...useFileRenamer(), ...useJobQueueInfo() };
    };

    return renderHook(() => useCustomHook(), { wrapper: JobQueueProvider });
  };
});
