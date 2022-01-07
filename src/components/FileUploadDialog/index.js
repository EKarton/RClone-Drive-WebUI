import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFileUploadCounts } from 'contexts/FileUploadCounts';
import { useFileUploader } from 'contexts/FileUploader';
import FileUploadProgressBar from './ProgressBar';
import Table from './Table';

export default function FileUploadDialog({ open, onClose }) {
  const { files } = useFileUploader();
  const { counts } = useFileUploadCounts();
  const { numSuccessful, numUploading } = counts;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" data-testid="file-upload-dialog">
      <DialogTitle>Upload Details</DialogTitle>
      <DialogContent>
        <FileUploadProgressBar
          numSuccessful={numSuccessful}
          numUploading={numUploading}
        />
        <Table files={files} />
      </DialogContent>
    </Dialog>
  );
}
