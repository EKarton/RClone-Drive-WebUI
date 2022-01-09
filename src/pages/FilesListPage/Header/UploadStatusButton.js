import CloudDoneIcon from '@mui/icons-material/CloudDone';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useFileUploadCounts } from 'contexts/FileUploadCounts';
import { useFileUploadDialog } from 'contexts/FileUploadDialog/index';

export default function UploadStatusButton() {
  const { openDialog } = useFileUploadDialog();
  const { counts } = useFileUploadCounts();
  const { numUploading, numSuccessful } = counts;

  if (numUploading === 0 && numSuccessful === 0) {
    return null;
  }

  if (numUploading === 0) {
    return (
      <Button startIcon={<CloudDoneIcon />} onClick={openDialog}>
        {numSuccessful} Uploaded
      </Button>
    );
  }

  return (
    <Button startIcon={<CircularProgress size={20} />} onClick={openDialog}>
      Uploading {numUploading} Files
    </Button>
  );
}
