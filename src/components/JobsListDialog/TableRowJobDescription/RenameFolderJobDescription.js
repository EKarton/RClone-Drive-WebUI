import { JobStatus } from 'utils/constants';

export default function RenameFolderJobDescription({ status, job }) {
  if (status === JobStatus.ERROR) {
    return (
      <span>
        Failed to rename folder {job.src.name} to {job.target.name} in {job.src.remote}:
        {job.src.dirPath}
      </span>
    );
  }

  if (status === JobStatus.SUCCESS) {
    return (
      <span>
        Renamed folder {job.src.name} to {job.target.name} in {job.src.remote}:
        {job.src.dirPath}
      </span>
    );
  }

  return (
    <span>
      Renaming folder {job.src.name} to {job.target.name} in {job.src.remote}:
      {job.src.dirPath}
    </span>
  );
}
