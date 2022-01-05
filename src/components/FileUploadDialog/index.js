import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useFileUploadCounts from 'contexts/FileUploadCounts/useFileUploadCounts';
import FileUploadProgressBar from './FileUploadProgressBar';
import Table from './Table';

export default function FileUploadDialog({ open, files, onClose }) {
  const { counts } = useFileUploadCounts();
  const { numSuccessful, numUploading } = counts;

  return (
    <Dialog
      className="upload-file-manager-dialog"
      data-testid="upload-file-manager-dialog"
      open={open}
      onClose={onClose}
      maxWidth="lg"
    >
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
