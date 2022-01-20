import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { startWith, pairwise } from 'rxjs/operators';
import { JobQueueContext, ActionTypes } from 'contexts/JobQueue';
import fileUploader from 'services/FileUploader/singleton';
import { JobTypes } from 'utils/constants';
import { getFullPath } from 'utils/filename-utils';
import useRCloneInfo from './useRCloneInfo';

export default function useFileUploader() {
  const { rCloneInfo } = useRCloneInfo();
  const { dispatch } = useContext(JobQueueContext);
  const { enqueueSnackbar } = useSnackbar();

  const uploadFileEntries = async (remote, dirPath, fileEntries) => {
    enqueueSnackbar('Uploading files...');

    const newJobObjects = await Promise.all(
      fileEntries.map(async (fileEntry) => {
        const relPath = fileEntry.fullPath
          .split('/')
          .filter((item) => item.length > 0)
          .slice(0, -1)
          .join('/');

        const newDirPath = getFullPath(dirPath, relPath);
        const file = await readFileFromFileEntry(fileEntry);
        const fileName = fileEntry.name;

        const fileObj = fileUploader.uploadFile(remote, newDirPath, file, rCloneInfo);
        const newJobObj = {
          ...fileObj,
          jobType: JobTypes.UPLOAD_FILE,
          remote,
          dirPath: newDirPath,
          name: fileName,
        };

        return newJobObj;
      })
    );

    dispatch({ type: ActionTypes.ADD_JOBS, payload: newJobObjects.reverse() });
    newJobObjects.forEach((jobObj) => {
      jobObj.status
        .pipe(startWith(null), pairwise())
        .subscribe(([prevStatus, curStatus]) => {
          if (prevStatus) {
            dispatch({
              type: ActionTypes.UPDATE_STATUS,
              payload: [prevStatus, curStatus],
            });
          } else {
            dispatch({ type: ActionTypes.ADD_STATUS_COUNT, payload: curStatus });
          }
        });
    });
  };

  const readFileFromFileEntry = (fileEntry) => {
    return new Promise((resolve, reject) => {
      fileEntry.file(resolve, reject);
    });
  };

  return { uploadFileEntries };
}
