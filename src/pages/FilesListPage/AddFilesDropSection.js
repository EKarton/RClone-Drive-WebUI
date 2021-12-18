import { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import useRCloneClient from 'hooks/useRCloneClient';
import './AddFilesDropSection.scss';

/**
 * This component is responsible for adding files to a remote via drag-and-drop
 */
export default function AddFilesDropSection(props) {
  const { remote, folderPath, children, onUploadedFiles } = props;
  const rCloneClient = useRCloneClient();
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const dataTransfer = e.dataTransfer;
    const pendingUploads = [];

    if (dataTransfer.items) {
      for (const item of dataTransfer.items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          pendingUploads.push(rCloneClient.uploadFiles(remote, folderPath, file));
        }
      }
    } else {
      for (const file of dataTransfer.files) {
        pendingUploads.push(rCloneClient.uploadFiles(remote, folderPath, file));
      }
    }

    await Promise.all(pendingUploads);
    onUploadedFiles();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  return (
    <div
      className={cx('add-files-drop-section', {
        'add-files-drop-section--on-hover': isDraggingFile,
      })}
      onDrop={handleDrop}
      onDragOver={handleDragEnter}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragLeave}
    >
      {children}
      {isDraggingFile && <div className="add-files-drop-section__overlay"></div>}
    </div>
  );
}

AddFilesDropSection.propType = {
  remote: PropTypes.string,
  folderPath: PropTypes.string,
  children: PropTypes.node,
  onUploadedFiles: PropTypes.func,
};
