import FolderTree from './FolderTree';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState } from 'react';

export default function FolderBrowserDialog({ remotes, open, onCancel, onOk, title }) {
  const [selectedFolder, setSelectedFolder] = useState('');

  const handleOk = () => {
    onOk(selectedFolder);
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
        <FolderTree remotes={remotes} onFolderSelect={setSelectedFolder} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk} data-testid="ok-button">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
