import { JobStatus } from 'services/RCloneJobTracker/constants';
import { getFullPath } from 'utils/filename-utils';

const getFileString = (file) => {
  return getFullRemotePath(file.remote, getFullPath(file.dirPath, file.name));
};

const getFullRemotePath = (remote, fullPath) => {
  return `${remote}:${fullPath}`;
};

function Upload({ status, job }) {
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

function MoveFile({ status, job }) {
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

function MoveFolder({ status, job }) {
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

function RenameFile({ status, job }) {
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

function RenameFolder({ status, job }) {
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

function GenericJob({ status }) {
  if (status === JobStatus.ERROR) {
    return <span>Job failed</span>;
  }

  if (status === JobStatus.SUCCESS) {
    return <span>Job succeeded</span>;
  }

  return <span>Job ongoing</span>;
}

export default function TableRowDescription({ status, job }) {
  if (job.jobType === 'UPLOAD_FILE') {
    return <Upload status={status} job={job} />;
  }

  if (job.jobType === 'MOVE_FILE') {
    return <MoveFile status={status} job={job} />;
  }

  if (job.jobType === 'MOVE_FOLDER') {
    return <MoveFolder status={status} job={job} />;
  }

  if (job.jobType === 'RENAME_FILE') {
    return <RenameFile status={status} job={job} />;
  }

  if (job.jobType === 'RENAME_FOLDER') {
    return <RenameFolder status={status} job={job} />;
  }

  return <GenericJob status={status} />;
}
