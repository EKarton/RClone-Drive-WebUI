import { JobStatus } from 'utils/constants';
import { getFullPath } from 'utils/filename-utils';

export default function MoveFileJobDescription({ status, job }) {
  const getFileString = (file) => {
    return `${file.remote}:${getFullPath(file.dirPath, file.name)}`;
  };

  if (status === JobStatus.ERROR) {
    return (
      <span>
        Failed to move file from {getFileString(job.src)} to {getFileString(job.target)}
      </span>
    );
  }

  if (status === JobStatus.SUCCESS) {
    return (
      <span>
        Moved file from {getFileString(job.src)} to {getFileString(job.target)}
      </span>
    );
  }

  return (
    <span>
      Moving file from {getFileString(job.src)} to {getFileString(job.target)}
    </span>
  );
}
