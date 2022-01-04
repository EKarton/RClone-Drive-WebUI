import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { UploadStatusTypes, useFileUploader } from 'contexts/FileUploader/index';

export function UploadStatusButton() {
  const { files, openDialog } = useFileUploader();

  const filesUploading = files.filter((f) => f.status === UploadStatusTypes.UPLOADING);
  const filesUploaded = files.filter((f) => f.status === UploadStatusTypes.SUCCESS);

  const numFilesUploading = filesUploading.length;
  const numFilesUploaded = filesUploaded.length;

  if (numFilesUploaded === 0 && numFilesUploading === 0) {
    return null;
  }

  if (numFilesUploading === 0) {
    return <Button onClick={openDialog}>{filesUploaded.length} Uploaded</Button>;
  }

  return (
    <Button startIcon={<CircularProgress size={20} />} onClick={openDialog}>
      Uploading {filesUploading.length} Files
    </Button>
  );
}
