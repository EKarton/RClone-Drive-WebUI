import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import useJobQueueInfo from 'hooks/jobs/useJobQueueInfo';
import { ImageMimeTypes, StatusTypes, JobStatus } from 'utils/constants';
import { getFileNames, getFolderNames } from './utils';
import { getUploadingFiles, getUploadingFolders, getMovingJobs } from './utils';

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

    const existingFileNames = getFileNames(data);
    const existingFolderNames = getFolderNames(data);

    setUploadingFiles([]);

    const fileNamesToFileObj = new Map();
    const folderNamesToFileObj = new Map();
    const subscribers = [];

    for (const fileJob of getUploadingFiles(jobs, remote, path)) {
      if (!fileNamesToFileObj.has(fileJob.name) && !existingFileNames.has(fileJob.name)) {
        const subscriber = fileJob.status.subscribe((status) => {
          if (status === JobStatus.SUCCESS) {
            refetchData();
          }
        });

        subscribers.push(subscriber);
        fileNamesToFileObj.set(fileJob.name, {
          name: fileJob.name,
          isDirectory: false,
          status: fileJob.status,
        });
      }
    }

    for (const folderJob of getUploadingFolders(jobs, remote, path)) {
      const firstFolderName = folderJob.dirPath
        .slice(path.length)
        .split('/')
        .filter((part) => part.length > 0)[0];

      if (existingFolderNames.has(firstFolderName)) {
        continue;
      }

      const fileObj = folderNamesToFileObj.get(firstFolderName) || {
        name: firstFolderName,
        isDirectory: true,
        status: new BehaviorSubject(folderJob.status.value),
      };

      const subscriber = folderJob.status.subscribe((status) => {
        if (status === JobStatus.SUCCESS) {
          refetchData();
        }

        fileObj.status.next(status);
      });

      if (!folderNamesToFileObj.has(firstFolderName)) {
        folderNamesToFileObj.set(firstFolderName, fileObj);
      }
      subscribers.push(subscriber);
    }

    setUploadingFiles([...fileNamesToFileObj.values(), ...folderNamesToFileObj.values()]);
    return () => subscribers.forEach((subscriber) => subscriber.unsubscribe());
  }, [data, jobs, path, refetchData, remote, status]);

  useEffect(() => {
    const subscribers = [];

    for (const job of getMovingJobs(jobs, remote, path)) {
      const subscriber = job.status.subscribe((status) => {
        if (status === JobStatus.SUCCESS) {
          refetchData();
        }
      });
      subscribers.push(subscriber);
    }

    return () => subscribers.forEach((sub) => sub.unsubscribe());
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
