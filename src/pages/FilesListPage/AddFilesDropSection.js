import cx from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { getFullPath } from 'utils/filename-utils';
import './AddFilesDropSection.scss';

/**
 * This component is responsible for adding files to a remote via drag-and-drop
 */
export default function AddFilesDropSection({
  remote,
  folderPath,
  children,
  onUploadedFiles,
}) {
  const rCloneClient = useRCloneClient();
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingFile(false);

    const readEntriesPromise = (directoryReader) => {
      return new Promise((resolve, reject) => {
        directoryReader.readEntries(resolve, reject);
      });
    };

    const readAllDirectoryEntries = async (directoryReader) => {
      const entries = [];
      let readEntries = await readEntriesPromise(directoryReader);

      while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await readEntriesPromise(directoryReader);
      }

      return entries;
    };

    const readFileFromFileEntry = (fileEntry) => {
      return new Promise((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });
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
    const pendingUploads = [];

    for (const fileEntry of fileEntries) {
      const fullPath = fileEntry.fullPath;
      const dirPath = fullPath
        .split('/')
        .filter((item) => item.length > 0)
        .slice(0, -1)
        .join('/');

      const dirPathInRemote = getFullPath(folderPath, dirPath);

      const pendingUpload = readFileFromFileEntry(fileEntry).then((file) => {
        return rCloneClient.uploadFiles(remote, dirPathInRemote, file);
      });

      pendingUploads.push(pendingUpload);
    }

    await Promise.allSettled(pendingUploads);
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
      data-testid="add-files-drop-section"
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
