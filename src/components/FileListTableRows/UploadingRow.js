import CircularProgress from '@mui/material/CircularProgress';
import prettyBytes from 'pretty-bytes';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { ICON_SIZE, UploadStatusTypes } from 'utils/constants';
import BaseRow from './BaseRow';
import FileIcon from './FileIcon';
import './UploadingRow.scss';

export default function UploadingRow({ file, iconSize }) {
  const [uploadStatus, setUploadStatus] = useState(file.uploadStatus.value);

  useEffect(() => {
    const subscriber = file.uploadStatus.subscribe((val) => {
      setUploadStatus(val);
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [file.uploadStatus]);

  const getUploadStatusText = () => {
    if (uploadStatus === UploadStatusTypes.SUCCESS) {
      return 'Uploaded just now';
    }

    if (uploadStatus === UploadStatusTypes.CANCELLED) {
      return 'Upload cancelled';
    }

    if (uploadStatus === UploadStatusTypes.NOT_STARTED) {
      return 'Scheduled to be uploaded';
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
      fileIcon={<FileIcon file={file} iconSize={iconSize} />}
      fileName={file.name}
      dateModified={getUploadStatusText()}
      fileSize={file.isDirectory ? '-' : prettyBytes(file.size)}
    />
  );
}

UploadingRow.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    lastUpdatedTime: PropTypes.string,
    size: PropTypes.number,
    isDirectory: PropTypes.bool.isRequired,
    isImage: PropTypes.bool.isRequired,
    uploadStatus: PropTypes.instanceOf(BehaviorSubject),
  }),
  iconSize: PropTypes.oneOf(Object.values(ICON_SIZE)),
  onFileOpen: PropTypes.func,
};
