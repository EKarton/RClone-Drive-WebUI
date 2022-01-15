import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { startWith, pairwise } from 'rxjs/operators';
import { ActionTypes } from 'contexts/JobQueue/actionTypes';
import { JobQueueContext } from 'contexts/JobQueue/index';
import FileUploader from 'services/FileUploader/index';
import { getFullPath } from 'utils/filename-utils';
import useRCloneInfo from './useRCloneInfo';

const fileUploader = new FileUploader();

export default function useFileUploaderV2() {
  const { rCloneInfo } = useRCloneInfo();
  const { dispatch } = useContext(JobQueueContext);
  //   const { enqueueSnackbar } = useSnackbar();

  const uploadFileEntry = async (remote, dirPath, fileEntry) => {
    const relPath = fileEntry.fullPath
      .split('/')
      .filter((item) => item.length > 0)
      .slice(0, -1)
      .join('/');

    const newDirPath = getFullPath(dirPath, relPath);
    const file = await readFileFromFileEntry(fileEntry);
    const fileName = fileEntry.name;

    const fileObj = fileUploader.uploadFile(remote, newDirPath, file, rCloneInfo);
    const newJobObj = { ...fileObj, jobType: 'UPLOAD_FILE', remote, dirPath, fileName };

    dispatch({ type: ActionTypes.ADD_JOB, payload: newJobObj });
    newJobObj.status
      .pipe(startWith(null), pairwise())
      .subscribe(([prevStatus, curStatus]) => {
        if (prevStatus) {
          dispatch({ type: ActionTypes.UPDATE_STATUS, payload: [prevStatus, curStatus] });
        } else {
          dispatch({ type: ActionTypes.ADD_STATUS_COUNT, payload: curStatus });
        }
      });

    // enqueueSnackbar(`Uploading ${file.name}`);
  };

  const readFileFromFileEntry = (fileEntry) => {
    const start = new Date().getTime();
    console.error('Start:', start);

    return new Promise((resolve, reject) => {
      fileEntry.file(
        (file) => {
          const end = new Date().getTime();
          const time = end - start;
          console.error('Time spent', time);
          console.error('End:', end);

          resolve(file);
        },
        (err) => {
          reject(err);
        }
      );
    });
  };

  return { uploadFileEntry };
}
