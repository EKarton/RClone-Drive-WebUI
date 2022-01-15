import cx from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useFileUploader from 'hooks/rclone/useFileUploader';
import './AddFilesDropSection.scss';

/**
 * This component is responsible for adding files to a remote via drag-and-drop
 */
export default function AddFilesDropSection({ remote, dirPath, children }) {
  const { uploadFileEntries } = useFileUploader();
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const readEntriesPromisified = (directoryReader) => {
      return new Promise((resolve, reject) => {
        directoryReader.readEntries(resolve, reject);
      });
    };

    const readAllDirectoryEntries = async (directoryReader) => {
      const entries = [];
      let readEntries = await readEntriesPromisified(directoryReader);

      while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await readEntriesPromisified(directoryReader);
      }

      return entries;
    };

    const getFileEntries = async (dataTransferItemList) => {
      const queue = [];
      const fileEntries = [];

      for (let i = 0; i < dataTransferItemList.length; i++) {
        queue.push(dataTransferItemList[i].webkitGetAsEntry());
      }

      while (queue.length > 0) {
        const entry = queue.shift();
        if (entry.isFile) {
          fileEntries.push(entry);
        } else {
          queue.push(...(await readAllDirectoryEntries(entry.createReader())));
        }
      }

      return fileEntries;
    };

    const fileEntries = await getFileEntries(e.dataTransfer.items);
    await uploadFileEntries(remote, dirPath, fileEntries);
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
      data-testid="add-files-drop-section"
    >
      {children}
      {isDraggingFile && <div className="add-files-drop-section__overlay"></div>}
    </div>
  );
}

AddFilesDropSection.propTypes = {
  remote: PropTypes.string,
  dirPath: PropTypes.string,
  children: PropTypes.node,
};
