import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function RenameFileDialog({ open, fileName, onCancel, onRename }) {
  const [newFileName, setNewFileName] = useState(null);

  const handleTextChanged = (e) => {
    setNewFileName(e.target.value);
  };

  const handleRename = () => {
    if (newFileName === null || newFileName === fileName) {
      onCancel();
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
      data-testid="rename-file-dialog"
    >
      <DialogTitle id="rename-file-dialog-title">
        Rename <strong>{fileName}</strong> to:
      </DialogTitle>
      <DialogContent>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          defaultValue={fileName}
          onChange={handleTextChanged}
          data-testid="rename-textbox"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} data-testid="cancel">
          Cancel
        </Button>
        <Button onClick={handleRename} data-testid="ok">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RenameFileDialog.propTypes = {
  open: PropTypes.bool,
  fileName: PropTypes.string,
  onCancel: PropTypes.func,
  onRename: PropTypes.func,
};
