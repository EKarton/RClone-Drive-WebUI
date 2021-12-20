import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

export default function RenameFileDialog({ open, fileName, onCancel, onRename }) {
  const [newFileName, setNewFileName] = useState(null);

  const handleTextChanged = (e) => {
    setNewFileName(e.target.value);
  };

  const handleRename = () => {
    if (newFileName === null || newFileName === fileName) {
      return;
    }

    onRename(newFileName);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="rename-file-dialog-title"
      aria-describedby="rename-file-dialog-description"
    >
      <DialogTitle id="rename-file-dialog-title">Rename File / Directory</DialogTitle>
      <DialogContent>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          defaultValue={fileName}
          onChange={handleTextChanged}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleRename}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
