import { JobStatus, JobTypes } from 'utils/constants';

export function getFileNames(data) {
  return new Set(data.filter((file) => !file.IsDir).map((file) => file.Name));
}

export function getFolderNames(data) {
  return new Set(data.filter((file) => file.IsDir).map((file) => file.Name));
}

export function getUploadingJobs(jobs, remote, path) {
  return jobs.filter(
    (job) =>
      job.jobType === JobTypes.UPLOAD_FILE &&
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
    JobTypes.MOVE_FILE,
    JobTypes.MOVE_FOLDER,
    JobTypes.RENAME_FILE,
    JobTypes.RENAME_FOLDER,
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
