import { renderHook } from '@testing-library/react-hooks';
import { useSnackbar } from 'notistack';
import { BehaviorSubject } from 'rxjs';
import { JobQueueProvider } from 'contexts/JobQueue/index';
import useJobQueueInfo from 'hooks/jobs/useJobQueueInfo';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import rCloneJobTracker from 'services/RCloneJobTracker/singleton';
import { JobStatus } from 'utils/constants';
import useFileMover from '../useFileMover';

jest.mock('services/RCloneJobTracker/singleton');
jest.mock('hooks/rclone/useRCloneClient');
jest.mock('hooks/rclone/useRCloneInfo');
jest.mock('notistack');

describe('useFileMover()', () => {
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

  it('should call functions and update context correctly when called moveFile()', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    rCloneJobTracker.trackNewJob.mockReturnValue({ status });

    const { result } = renderUseFileMoverHook();
    const src = { remote: 'gdrive', dirPath: 'Documents', name: 'Dog.png' };
    const target = { remote: 'onedrive', dirPath: 'Documents', name: 'Cat.png' };
    await result.current.moveFile(src, target);

    expect(moveFile).toBeCalledWith(src, target, { isAsync: true });
    expect(rCloneJobTracker.trackNewJob).toBeCalledWith(jobId, rCloneInfo);
    expect(enqueueSnackbar).toBeCalled();
    expect(result.current.jobs.length).toEqual(1);
    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 1,
      numSuccessful: 0,
    });
  });

  it('should call functions and update context correctly when called moveFolder()', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    rCloneJobTracker.trackNewJob.mockReturnValue({ status });

    const { result } = renderUseFileMoverHook();
    const src = { remote: 'gdrive', dirPath: 'Documents', name: 'Personal' };
    const target = { remote: 'onedrive', dirPath: 'Documents', name: 'Personal' };
    await result.current.moveFolder(src, target);

    const opts = { createEmptySrcDirs: true, deleteEmptySrcDirs: true, isAsync: true };
    expect(move).toBeCalledWith(src, target, opts);
    expect(rCloneJobTracker.trackNewJob).toBeCalledWith(jobId, rCloneInfo);
    expect(enqueueSnackbar).toBeCalled();
    expect(result.current.jobs.length).toEqual(1);
    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 1,
      numSuccessful: 0,
    });
  });

  it('should update counts correctly when job status updates', async () => {
    const status = new BehaviorSubject(JobStatus.ONGOING);
    rCloneJobTracker.trackNewJob.mockReturnValue({ status });

    const { result } = renderUseFileMoverHook();
    const src = { remote: 'gdrive', dirPath: 'Documents', name: 'Personal' };
    const target = { remote: 'onedrive', dirPath: 'Documents', name: 'Personal' };
    await result.current.moveFolder(src, target);
    status.next(JobStatus.SUCCESS);

    expect(result.current.statusCounts).toEqual({
      numFailed: 0,
      numOngoing: 0,
      numSuccessful: 1,
    });
  });

  const renderUseFileMoverHook = () => {
    const useCustomHook = () => {
      return { ...useFileMover(), ...useJobQueueInfo() };
    };

    return renderHook(() => useCustomHook(), { wrapper: JobQueueProvider });
  };
});
