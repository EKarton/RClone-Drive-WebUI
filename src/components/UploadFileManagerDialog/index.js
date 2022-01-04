import Dialog from '@mui/material/Dialog';

export default function UploadFileManagerDialog({ open, files, onClose }) {
  return (
    <Dialog
      className="upload-file-manager-dialog"
      data-testid="upload-file-manager-dialog"
      open={open}
      onClose={onClose}
    >
      {files.map((file) => file.name)}
    </Dialog>
  );
}
