import { JobStatus } from 'utils/constants';
import { getFullPath } from 'utils/filename-utils';

export default function MoveFolderJobDescription({ status, job }) {
  const getFileString = (file) => {
    return `${file.remote}:${getFullPath(file.dirPath, file.name)}`;
  };

  if (status === JobStatus.ERROR) {
    return (
      <span>
        Failed to move folder from {getFileString(job.src)} to {getFileString(job.target)}
      </span>
    );
  }

  if (status === JobStatus.SUCCESS) {
    return (
      <span>
        Moved folder from {getFileString(job.src)} to {getFileString(job.target)}
      </span>
    );
  }

  return (
    <span>
      Moving folder from {getFileString(job.src)} to {getFileString(job.target)}
    </span>
  );
}
