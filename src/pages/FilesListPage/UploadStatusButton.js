import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import useFileUploadCounts from 'contexts/FileUploadCounts/useFileUploadCounts';
import { useFileUploadDialog } from 'contexts/FileUploaderDialog/index';

export default function UploadStatusButton() {
  const { openDialog } = useFileUploadDialog();
  const { counts } = useFileUploadCounts();
  const { numUploading, numSuccessful } = counts;

  if (numUploading === 0) {
    return <Button onClick={openDialog}>{numSuccessful} Uploaded</Button>;
  }

  return (
    <Button startIcon={<CircularProgress size={20} />} onClick={openDialog}>
      Uploaded {numSuccessful} / {numUploading + numSuccessful} Files
    </Button>
  );
}
