import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState } from 'react';
import FolderTree from 'components/FolderTree';

/**
 * Represents the dialog that appears when a user clicks on a remote
 */
export default function FolderBrowserDialog({ remotes, open, onCancel, onOk, title }) {
  const [remotePath, setRemotePath] = useState('');

  const handleFolderTreeSelected = (remotePath) => {
    setRemotePath(remotePath);
  };

  const handleOk = () => {
    if (!remotePath) {
      onCancel();
      return;
    }

    onOk(remotePath);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={onCancel}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <FolderTree remotes={remotes} onSelect={handleFolderTreeSelected} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} data-testid="cancel-button">
          Cancel
        </Button>
        <Button onClick={handleOk} data-testid="ok-button">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
