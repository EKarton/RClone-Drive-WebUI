import { JobTypes } from 'utils/constants';
import GenericJobDescription from './GenericJobDescription';
import MoveFileJobDescription from './MoveFileJobDescription';
import MoveFolderJobDescription from './MoveFolderJobDescription';
import RenameFileJobDescription from './RenameFileJobDescription';
import RenameFolderJobDescription from './RenameFolderJobDescription';
import UploadJobDescription from './UploadJobDescription';

export default function TableRowDescription({ status, job }) {
  if (job.jobType === JobTypes.UPLOAD_FILE) {
    return <UploadJobDescription status={status} job={job} />;
  }

  if (job.jobType === JobTypes.MOVE_FILE) {
    return <MoveFileJobDescription status={status} job={job} />;
  }

  if (job.jobType === JobTypes.MOVE_FOLDER) {
    return <MoveFolderJobDescription status={status} job={job} />;
  }

  if (job.jobType === JobTypes.RENAME_FILE) {
    return <RenameFileJobDescription status={status} job={job} />;
  }

  if (job.jobType === JobTypes.RENAME_FOLDER) {
    return <RenameFolderJobDescription status={status} job={job} />;
  }

  return <GenericJobDescription status={status} />;
}
