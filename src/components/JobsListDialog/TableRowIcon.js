import BackupIcon from '@mui/icons-material/Backup';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import TaskIcon from '@mui/icons-material/Task';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { JobTypes } from 'utils/constants';

export default function TableRowIcon({ jobType }) {
  const renderIcon = () => {
    switch (jobType) {
      case JobTypes.UPLOAD_FILE: {
        return <BackupIcon />;
      }
      case JobTypes.MOVE_FILE:
      case JobTypes.MOVE_FOLDER: {
        return <DriveFileMoveIcon />;
      }
      case JobTypes.RENAME_FILE:
      case JobTypes.RENAME_FOLDER: {
        return <DriveFileRenameOutlineIcon />;
      }
      default: {
        return <TaskIcon />;
      }
    }
  };

  return (
    <Tooltip title={jobType} arrow>
      <span>{renderIcon()}</span>
    </Tooltip>
  );
}

TableRowIcon.propTypes = {
  jobType: PropTypes.string,
};
