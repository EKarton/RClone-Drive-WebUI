import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { startWith, pairwise } from 'rxjs/operators';
import { JobQueueContext, ActionTypes } from 'contexts/JobQueue';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import rCloneJobTracker from 'services/RCloneJobTracker/singleton';
import { JobTypes } from 'utils/constants';

export default function useFileRenamer() {
  const { rCloneInfo } = useRCloneInfo();
  const { enqueueSnackbar } = useSnackbar();
  const rCloneClient = useRCloneClient();
  const { dispatch } = useContext(JobQueueContext);

  const renameFolder = async (remote, dirPath, oldName, newName) => {
    const src = { remote, dirPath, name: oldName };
    const target = { remote, dirPath, name: newName };

    const response = await rCloneClient.move(src, target, { isAsync: true });
    const jobId = response.data.jobid;

    enqueueJob(jobId, JobTypes.RENAME_FOLDER, src, target);
    enqueueSnackbar(`Renaming folder ${src.name} to ${target.name}`);
  };

  const renameFile = async (remote, dirPath, oldName, newName) => {
    const src = { remote, dirPath, name: oldName };
    const target = { remote, dirPath, name: newName };

    const response = await rCloneClient.moveFile(src, target, { isAsync: true });
    const jobId = response.data.jobid;

    enqueueJob(jobId, JobTypes.RENAME_FILE, src, target);
    enqueueSnackbar(`Renaming file ${src.name} to ${target.name}`);
  };

  const enqueueJob = (jobId, jobType, src, target) => {
    const jobObj = rCloneJobTracker.trackNewJob(jobId, rCloneInfo);
    const newJobObj = { ...jobObj, jobType, src, target };

    dispatch({ type: ActionTypes.ADD_JOB, payload: newJobObj });

    newJobObj.status
      .pipe(startWith(null), pairwise())
      .subscribe(([prevStatus, curStatus]) => {
        if (prevStatus) {
          dispatch({
            type: ActionTypes.UPDATE_STATUS,
            payload: [prevStatus, curStatus],
          });
        } else {
          dispatch({
            type: ActionTypes.ADD_STATUS_COUNT,
            payload: curStatus,
          });
        }
      });
  };

  return { renameFile, renameFolder };
}
