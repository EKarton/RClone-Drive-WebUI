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
    const { src } = job;
    const srcStr = getFileString(src);

    if (status === JobStatus.ERROR) {
      return `Failed to move ${srcStr}`;
    }

    if (status === JobStatus.SUCCESS) {
      return `Moved ${srcStr}`;
    }

    return `Moving ${srcStr}`;
  };

  const getRenameMessage = () => {
    const { src, target } = job;
    const remotePath = `${src.remote}:${src.dirPath}`;

    if (status === JobStatus.ERROR) {
      return `Failed to rename ${src.name}`;
    }

    if (status === JobStatus.SUCCESS) {
      return `Renamed ${src.name} to ${target.name}`;
    }

    return `Renaming ${src.name} to ${target.name}`;
  };

  const getUploadMessage = () => {
    const { name } = job;

    if (status === JobStatus.ERROR) {
      return `Failed to upload ${name}`;
    }

    if (status === JobStatus.SUCCESS) {
      return `Uploaded ${name}`;
    }

    return `Uploading ${name}`;
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
