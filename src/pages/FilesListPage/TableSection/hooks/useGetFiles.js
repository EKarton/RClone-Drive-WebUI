import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { useFileUploader } from 'contexts/FileUploader';
import useFetchFiles from 'hooks/fetch-data/useFetchFiles';
import { ImageMimeTypes, StatusTypes, UploadStatusTypes } from 'utils/constants';
import { getFullPath } from 'utils/filename-utils';

export default function useGetFiles(remote, path) {
  const { status, data, error, refetchData } = useFetchFiles(remote, path);
  const { files } = useFileUploader();
  const [uploadingFiles, setUploadingFiles] = useState([]);

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

    for (const file of files) {
      if (file.remote !== remote || !file.dirPath.startsWith(path)) {
        continue;
      }

      if (file.status.value === UploadStatusTypes.SUCCESS) {
        continue;
      }

      if (file.dirPath === path && !fileNamesToFileObj.has(file.name)) {
        if (existingFileNames.has(file.name)) {
          continue;
        }

        const fileObj = {
          remote,
          folderPath: path,
          path: getFullPath(path, file.name),
          name: file.name,
          size: file.size,
          mimeType: file.type,
          isDirectory: false,
          uploadStatus: new BehaviorSubject(file.status.value),
        };

        const subscriber = file.status.subscribe((status) => {
          if (status === UploadStatusTypes.SUCCESS) {
            refetchData();
          }
          fileObj.uploadStatus.next(status);
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
          remote,
          folderPath: path,
          path: getFullPath(path, folderName),
          name: folderName,
          isDirectory: true,
          uploadStatus: new BehaviorSubject(file.status.value),
        };

        const subscriber = file.status.subscribe((status) => {
          if (status === UploadStatusTypes.SUCCESS) {
            refetchData();
          }
          fileObj.uploadStatus.next(status);
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
  }, [data, files, path, refetchData, remote, status]);

  if (status !== StatusTypes.SUCCESS) {
    return { status, data, error, refetchData };
  }

  return {
    status,
    error,
    data: {
      existingFiles: data.map((rawFileData) => ({
        remote,
        folderPath: path,
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
