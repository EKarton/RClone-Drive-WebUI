import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { ICON_SIZE, JobStatus } from 'utils/constants';
import BaseRow from './BaseRow';
import './UploadingRow.scss';

export default function UploadingRow({ file, iconSize }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const subscriber = file.status.subscribe((val) => {
      setStatus(val);
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [file.status]);

  const getIcon = () => {
    if (file.isDirectory) {
      return <FolderIcon fontSize={iconSize} />;
    }

    return <DescriptionIcon fontSize={iconSize} />;
  };

  const getUploadStatusText = () => {
    if (status === JobStatus.SUCCESS) {
      return 'Uploaded just now';
    }

    if (status === JobStatus.ERROR) {
      return 'Upload failed';
    }

    return (
      <div className="uploading-row__status-text-wrapper">
        <CircularProgress size={20} />
        <span>Uploading...</span>
      </div>
    );
  };

  return (
    <BaseRow
      fileIcon={getIcon()}
      fileName={file.name}
      dateModified={getUploadStatusText()}
      fileSize="-"
    />
  );
}

UploadingRow.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    isDirectory: PropTypes.bool,
    status: PropTypes.instanceOf(BehaviorSubject),
  }),
  iconSize: PropTypes.oneOf(Object.values(ICON_SIZE)),
};
