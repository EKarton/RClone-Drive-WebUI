import { JobStatus } from 'utils/constants';

export default function RenameFileJobDescription({ status, job }) {
  if (status === JobStatus.ERROR) {
    return (
      <span>
        Failed to rename file {job.src.name} to {job.target.name} in {job.src.remote}:
        {job.src.dirPath}
      </span>
    );
  }

  if (status === JobStatus.SUCCESS) {
    return (
      <span>
        Renamed file {job.src.name} to {job.target.name} in {job.src.remote}:
        {job.src.dirPath}
      </span>
    );
  }

  return (
    <span>
      Renaming file {job.src.name} to {job.target.name} in {job.src.remote}:
      {job.src.dirPath}
    </span>
  );
}
