import { JobStatus } from 'utils/constants';

export default function UploadJobDescription({ status, job }) {
  if (status === JobStatus.ERROR) {
    return (
      <span>
        Failed to upload file {job.name} to {job.remote}:{job.dirPath}
      </span>
    );
  }

  if (status === JobStatus.SUCCESS) {
    return (
      <span>
        Uploaded file {job.name} to {job.remote}:{job.dirPath}
      </span>
    );
  }

  return (
    <span>
      Uploading file {job.name} to {job.remote}:{job.dirPath}
    </span>
  );
}
