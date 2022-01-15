import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';
import { JobStatus } from 'services/RCloneJobTracker/constants';
import { getFullPath } from 'utils/filename-utils';

export default function JobListItem({ job }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const subscriber = job.status.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      subscriber.unsubscribe();
    };
  });

  const getMessage = () => {
    switch (job.jobType) {
      case 'MOVE_FILE':
      case 'MOVE_FOLDER': {
        return getMoveMessage();
      }
      case 'RENAME_FILE':
      case 'RENAME_FOLDER': {
        return getRenameMessage();
      }
      case 'UPLOAD_FILE': {
        return getUploadMessage();
      }
      default: {
        return getDefaultString();
      }
    }
  };

  const getMoveMessage = () => {
    const { src, target } = job;
    const srcStr = getFileString(src);
    const targetStr = getFileString(target);

    if (status === JobStatus.ERROR) {
      return `Failed to move ${srcStr} to ${targetStr}`;
    }

    if (status === JobStatus.SUCCESS) {
      return `Moved ${srcStr} to ${targetStr}`;
    }

    return `Moving ${srcStr} to ${targetStr}`;
  };

  const getRenameMessage = () => {
    const { src, target } = job;
    const remotePath = `${src.remote}:${src.dirPath}`;

    if (status === JobStatus.ERROR) {
      return `Failed to rename ${src.name} to ${target.name} in ${remotePath}`;
    }

    if (status === JobStatus.SUCCESS) {
      return `Renamed ${src.name} to ${target.name} in ${remotePath}`;
    }

    return `Renaming ${src.name} to ${target.name} in ${remotePath}`;
  };

  const getUploadMessage = () => {
    const { fileName } = job;

    if (status === JobStatus.ERROR) {
      return `Failed to upload ${fileName}`;
    }

    if (status === JobStatus.SUCCESS) {
      return `Uploaded ${fileName}`;
    }

    return `Uploading ${fileName}`;
  };

  const getDefaultString = () => {
    if (status === JobStatus.ERROR) {
      return 'Failed job';
    }

    if (status === JobStatus.SUCCESS) {
      return 'Job succeeded';
    }

    return 'Job running';
  };

  const getFileString = (file) => {
    return getFullRemotePath(file.remote, getFullPath(file.dirPath, file.name));
  };

  const getFullRemotePath = (remote, fullPath) => {
    return `${remote}:${fullPath}`;
  };

  return (
    <ListItem>
      <ListItemText primary={getMessage()} />
    </ListItem>
  );
}
