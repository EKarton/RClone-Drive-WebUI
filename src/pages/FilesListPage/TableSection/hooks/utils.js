import { JobStatus } from 'services/RCloneJobTracker/constants';

export function getFileNames(data) {
  return new Set(data.filter((file) => !file.IsDir).map((file) => file.Name));
}

export function getFolderNames(data) {
  return new Set(data.filter((file) => file.IsDir).map((file) => file.Name));
}

export function getUploadingJobs(jobs, remote, path) {
  return jobs.filter(
    (job) =>
      job.jobType === 'UPLOAD_FILE' &&
      job.remote === remote &&
      job.dirPath.startsWith(path) &&
      job.status.value !== JobStatus.SUCCESS
  );
}

export function getUploadingFiles(jobs, remote, path) {
  return getUploadingJobs(jobs, remote, path).filter((job) => job.dirPath === path);
}

export function getUploadingFolders(jobs, remote, path) {
  return getUploadingJobs(jobs, remote, path).filter((job) => job.dirPath !== path);
}

export function getMovingJobs(jobs, remote, path) {
  const supportedJobTypes = new Set([
    'MOVE_FILE',
    'MOVE_FILES',
    'RENAME_FILE',
    'RENAME_FILES',
  ]);

  return jobs.filter((job) => {
    const correctJob = supportedJobTypes.has(job.jobType);
    const inProgress = job.status.value === JobStatus.ONGOING;

    if (!correctJob || !inProgress) {
      return false;
    }

    const isMatchSrc = job.src?.remote === remote && job.src?.dirPath === path;
    const isMatchTarget = job.target?.remote === remote && job.target?.dirPath === path;

    return correctJob && inProgress && (isMatchSrc || isMatchTarget);
  });
}
