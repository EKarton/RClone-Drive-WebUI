import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { useJobQueueInfo } from 'contexts/JobQueue/index';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import { JobStatus } from 'services/RCloneJobTracker/constants';
import { ImageMimeTypes, StatusTypes } from 'utils/constants';

export default function useGetFiles(remote, path) {
  const { jobs } = useJobQueueInfo();
  const { status, data, error, refetchData } = useFetchFiles(remote, path);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  /**
   * Get a list of uploading files and folders, and a list of
   * existing files and folders, and automatically refetch the data
   * when a file / folder is uploaded
   */
  useEffect(() => {
    if (status !== StatusTypes.SUCCESS) {
      return;
    }

    const existingFileNames = new Set();
    const existingFolderNames = new Set();

    for (const existingFile of data) {
      if (existingFile.IsDir) {
        existingFolderNames.add(existingFile.Name);
      } else {
        existingFileNames.add(existingFile.Name);
      }
    }

    setUploadingFiles([]);

    const fileNamesToFileObj = new Map();
    const folderNamesToFileObj = new Map();
    const subscribers = [];

    for (const file of jobs) {
      if (file.jobType !== 'UPLOAD_FILE') {
        continue;
      }

      if (file.remote !== remote || !file.dirPath.startsWith(path)) {
        continue;
      }

      if (file.status.value === JobStatus.SUCCESS) {
        continue;
      }

      if (file.dirPath === path && !fileNamesToFileObj.has(file.name)) {
        if (existingFileNames.has(file.name)) {
          continue;
        }

        const fileObj = {
          name: file.name,
          isDirectory: false,
          status: file.status,
        };

        const subscriber = file.status.subscribe((status) => {
          if (status === JobStatus.SUCCESS) {
            refetchData();
          }
        });

        fileNamesToFileObj.set(file.name, fileObj);
        subscribers.push(subscriber);
      } else {
        const parts = file.dirPath
          .slice(path.length)
          .split('/')
          .filter((part) => part.length > 0);

        const folderName = parts[0];

        if (existingFolderNames.has(folderName)) {
          continue;
        }

        const fileObj = folderNamesToFileObj.get(folderName) || {
          name: folderName,
          isDirectory: true,
          status: new BehaviorSubject(file.status.value),
        };

        const subscriber = file.status.subscribe((status) => {
          if (status === JobStatus.SUCCESS) {
            refetchData();
          }

          fileObj.status.next(status);
        });

        if (!folderNamesToFileObj.has(folderName)) {
          folderNamesToFileObj.set(folderName, fileObj);
        }
        subscribers.push(subscriber);
      }
    }

    const mergedFileObjs = [
      ...fileNamesToFileObj.values(),
      ...folderNamesToFileObj.values(),
    ];

    setUploadingFiles(mergedFileObjs);

    return () => {
      subscribers.forEach((subscriber) => subscriber.unsubscribe());
    };
  }, [data, jobs, path, refetchData, remote, status]);

  useEffect(() => {
    const supportedJobTypes = new Set([
      'MOVE_FILE',
      'MOVE_FILES',
      'RENAME_FILE',
      'RENAME_FILES',
    ]);

    const subscribers = [];

    for (const job of jobs) {
      if (!supportedJobTypes.has(job.jobType)) {
        continue;
      }

      if (job.status.value !== JobStatus.ONGOING) {
        continue;
      }

      const isMatchSrc = job.src.remote === remote && job.src.dirPath === path;
      const isMatchTarget = job.target.remote === remote && job.target.dirPath === path;

      if (!isMatchSrc && !isMatchTarget) {
        continue;
      }

      const subscriber = job.status.subscribe((status) => {
        if (status === JobStatus.SUCCESS) {
          refetchData();
        }
      });

      subscribers.push(subscriber);
    }

    return () => {
      subscribers.forEach((sub) => sub.unsubscribe());
    };
  });

  if (status !== StatusTypes.SUCCESS) {
    return { status, data, error, refetchData };
  }

  return {
    status,
    error,
    data: {
      existingFiles: data.map((rawFileData) => ({
        remote,
        dirPath: path,
        path: rawFileData.Path,
        name: rawFileData.Name,
        lastUpdatedTime: rawFileData.ModTime,
        size: rawFileData.Size,
        mimeType: rawFileData.MimeType,
        isDirectory: rawFileData.IsDir,
        isImage: ImageMimeTypes.has(rawFileData.MimeType),
      })),
      uploadingFiles,
    },
    refetchData,
  };
}
